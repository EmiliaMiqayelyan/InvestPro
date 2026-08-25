import type { Project, RiskAnalysis } from "../types";

export function analyzeProjectRisk(project: Project): RiskAnalysis {
  const positive: RiskAnalysis["positiveIndicators"] = [];
  const warnings: RiskAnalysis["warningIndicators"] = [];
  const missing: string[] = [];
  const missingHy: string[] = [];
  const questions: string[] = [];
  const questionsHy: string[] = [];

  let score = 55;
  const phases = project.phases || [];
  const phaseBudgetTotal = phases.reduce((sum, ph) => sum + (ph.budgetAsk || 0), 0);
  const phaseBudgetGap = project.requiredInvestment - phaseBudgetTotal;

  if (project.documents.some((d) => d.category === "business_plan")) {
    positive.push({
      label: "Business plan uploaded",
      labelHy: "Բիզնես պլանը վերբեռնված է",
      detail: "Core planning document is available.",
      detailHy: "Հիմնական պլանավորման փաստաթուղթը հասանելի է։",
    });
    score += 8;
  } else {
    missing.push("Business plan");
    missingHy.push("Բիզնես պլան");
    warnings.push({
      label: "Missing business plan",
      labelHy: "Բացակայում է բիզնես պլանը",
      detail: "Investors cannot validate strategy depth.",
      detailHy: "Ներդրողները չեն կարող ստուգել ռազմավարության խորությունը։",
    });
    score -= 10;
  }

  if (project.documents.some((d) => d.category === "pitch_deck")) {
    positive.push({
      label: "Pitch deck available",
      labelHy: "Pitch deck-ը հասանելի է",
      detail: "Presentation materials are ready for diligence.",
      detailHy: "Ներկայացման նյութերը պատրաստ են ստուգման համար։",
    });
    score += 5;
  } else {
    missing.push("Pitch deck");
    missingHy.push("Pitch deck");
  }

  if (project.documents.some((d) => d.category === "legal")) {
    positive.push({
      label: "Legal documents present",
      labelHy: "Իրավական փաստաթղթեր կան",
      detail: "Legal package supports compliance review.",
      detailHy: "Իրավական փաթեթը աջակցում է համապատասխանության վերանայմանը։",
    });
    score += 8;
  } else {
    missing.push("Legal documents");
    missingHy.push("Իրավական փաստաթղթեր");
    warnings.push({
      label: "No legal package",
      labelHy: "Իրավական փաթեթ չկա",
      detail: "Entity and IP status may be unclear.",
      detailHy: "Կազմակերպության և մտավոր սեփականության կարգավիճակը կարող է անհասկանալի լինել։",
    });
    score -= 8;
  }

  if (project.documents.some((d) => d.category === "finance_plan")) {
    positive.push({
      label: "Finance plan available",
      labelHy: "Ֆինանսական պլանը հասանելի է",
      detail: "Dedicated finance plan supports capital allocation review.",
      detailHy: "Առանձին ֆինանսական պլանը աջակցում է կապիտալի բաշխման վերանայմանը։",
    });
    score += 5;
  } else {
    missing.push("Finance plan");
    missingHy.push("Ֆինանսական պլան");
  }

  if (phases.length >= 2) {
    positive.push({
      label: "Phased capital plan",
      labelHy: "Փուլային կապիտալի պլան",
      detail: `${phases.length} funding phases disclosed with budgets.`,
      detailHy: `${phases.length} ֆինանսավորման փուլեր բյուջեներով։`,
    });
    score += 6;
  } else {
    warnings.push({
      label: "Missing phases",
      labelHy: "Փուլերը բացակայում են",
      detail: "Fewer than 2 investment phases defined.",
      detailHy: "Սահմանված է 2-ից պակաս ներդրումային փուլ։",
    });
    score -= 5;
  }

  if (Math.abs(phaseBudgetGap) <= project.requiredInvestment * 0.05) {
    positive.push({
      label: "Phase budgets aligned",
      labelHy: "Փուլերի բյուջեները համաձայնեցված են",
      detail: "Phase asks roughly match the total raise.",
      detailHy: "Փուլերի պահանջները մոտավորապես համընկնում են ընդհանուր հավաքագրման հետ։",
    });
    score += 4;
  } else if (phases.length > 0) {
    warnings.push({
      label: "Phase budget gap",
      labelHy: "Փուլերի բյուջեի անհամապատասխանություն",
      detail: `Phase total differs from raise by $${Math.abs(phaseBudgetGap).toLocaleString()}.`,
      detailHy: `Փուլերի գումարը տարբերվում է հավաքագրումից $${Math.abs(phaseBudgetGap).toLocaleString()}-ով։`,
    });
    score -= 4;
  }

  if (project.team.length >= 3) {
    positive.push({
      label: "Complete founding team",
      labelHy: "Լրիվ հիմնադիր թիմ",
      detail: `${project.team.length} team profiles listed.`,
      detailHy: `${project.team.length} թիմի պրոֆիլ նշված է։`,
    });
    score += 7;
  } else {
    warnings.push({
      label: "Thin team roster",
      labelHy: "Թույլ թիմի կազմ",
      detail: "Fewer than 3 team members disclosed.",
      detailHy: "Բացահայտված է 3-ից պակաս թիմի անդամ։",
    });
    score -= 6;
  }

  if (project.team.some((t) => t.role === "advisor")) {
    positive.push({
      label: "Advisor on board",
      labelHy: "Խորհրդատու կա",
      detail: "External advisory support disclosed.",
      detailHy: "Արտաքին խորհրդատվական աջակցությունը բացահայտված է։",
    });
    score += 4;
  }

  if (project.financialProjections && project.financialProjections.length > 40) {
    positive.push({
      label: "Financial projections provided",
      labelHy: "Ֆինանսական կանխատեսումներ կան",
      detail: "Forward-looking numbers are documented.",
      detailHy: "Ապագա թվերը փաստաթղթավորված են։",
    });
    score += 6;
  } else {
    warnings.push({
      label: "Weak financial detail",
      labelHy: "Թույլ ֆինանսական մանրամաս",
      detail: "Projections appear incomplete.",
      detailHy: "Կանխատեսումները թերի են թվում։",
    });
    score -= 7;
  }

  if (project.ownerKycStatus === "approved") {
    positive.push({
      label: "Owner KYC approved",
      labelHy: "Սեփականատիրոջ KYC-ն հաստատված է",
      detail: "Project owner identity verification is complete.",
      detailHy: "Նախագծի սեփականատիրոջ ինքնության ստուգումն ավարտված է։",
    });
    score += 4;
  } else {
    warnings.push({
      label: "Owner KYC incomplete",
      labelHy: "Սեփականատիրոջ KYC-ն թերի է",
      detail: "Owner verification is not fully approved.",
      detailHy: "Սեփականատիրոջ ստուգումը լրիվ հաստատված չէ։",
    });
    score -= 3;
  }

  if (project.requiredInvestment > 0 && project.currentFunding / project.requiredInvestment > 0.4) {
    positive.push({
      label: "Strong funding traction",
      labelHy: "Ուժեղ ֆինանսավորման առաջընթաց",
      detail: `${Math.round((project.currentFunding / project.requiredInvestment) * 100)}% of goal raised.`,
      detailHy: `Նպատակի ${Math.round((project.currentFunding / project.requiredInvestment) * 100)}%-ը հավաքված է։`,
    });
    score += 5;
  }

  if (project.riskLevel === "high") score -= 8;
  if (project.riskLevel === "low") score += 6;

  questions.push("What is your current monthly burn rate and runway?");
  questionsHy.push("Որքա՞ն է ձեր ամսական ծախսը և աշխատանքային կապիտալի պահուստը։");
  questions.push("Who are your top three competitors and differentiation?");
  questionsHy.push("Ովքե՞ր են ձեր երեք հիմնական մրցակիցները և տարբերակիչ առավելությունը։");
  questions.push("How will investor funds be ring-fenced and reported?");
  questionsHy.push("Ինչպե՞ս կմեկուսացվեն և կհաղորդվեն ներդրողների միջոցները։");
  if (phases.length > 0) {
    questions.push("How do phase deliverables unlock the next capital tranche?");
    questionsHy.push("Ինչպե՞ս են փուլի արդյունքները բացում հաջորդ կապիտալի մասը։");
  }
  if (missing.includes("Legal documents")) {
    questions.push("Can you share incorporation docs and cap table?");
    questionsHy.push("Կարո՞ղ եք կիսվել գրանցման փաստաթղթերով և կապիտալի աղյուսակով։");
  }
  if (!project.documents.some((d) => d.category === "certificate")) {
    missing.push("Certificates / compliance proofs");
    missingHy.push("Վկայագրեր / համապատասխանության ապացույցներ");
    questions.push("Do you hold any industry certifications or audits?");
    questionsHy.push("Ունե՞ք արդյոք արդյունաբերական վկայագրեր կամ աուդիտներ։");
  }

  score = Math.max(5, Math.min(95, score));
  const level = score >= 70 ? "low" : score >= 45 ? "medium" : "high";
  const completeness = Math.round(
    (((project.documents.length > 0 ? 1 : 0) +
      (project.team.length > 0 ? 1 : 0) +
      (project.financialProjections ? 1 : 0) +
      (project.investmentPlan ? 1 : 0) +
      (project.businessModel ? 1 : 0) +
      (phases.length >= 2 ? 1 : 0)) /
      6) *
      100
  );

  const summary =
    level === "low"
      ? "Overall diligence posture looks solid with strong documentation, phases, and team disclosure."
      : level === "medium"
        ? "Moderate risk — several strengths exist, but investors should clarify gaps before committing."
        : "Elevated risk — missing materials and weak signals warrant caution before investing.";
  const summaryHy =
    level === "low"
      ? "Ընդհանուր ստուգման վիճակը ամուր է՝ ուժեղ փաստաթղթավորմամբ, փուլերով և թիմի բացահայտմամբ։"
      : level === "medium"
        ? "Միջին ռիսկ — կան ուժեղ կողմեր, սակայն ներդրողները պետք է պարզեն բացերը մինչև պարտավորվելը։"
        : "Բարձր ռիսկ — բացակայող նյութերն ու թույլ ազդանշանները զգուշություն են պահանջում։";

  return {
    projectId: project.id,
    score,
    level,
    completeness,
    positiveIndicators: positive,
    warningIndicators: warnings,
    missingDocuments: missing,
    missingDocumentsHy: missingHy,
    questionsToAsk: questions,
    questionsToAskHy: questionsHy,
    summary,
    summaryHy,
    phaseBudgetTotal,
    phaseBudgetGap,
    generatedAt: new Date().toISOString(),
  };
}
