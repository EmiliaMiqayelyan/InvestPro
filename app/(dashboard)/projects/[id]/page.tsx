"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProjectImage } from "@/components/shared/project-image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, FileText, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardSkeleton } from "@/components/shared/loading-skeleton";
import { QUERY_KEYS } from "@/constants";
import { projectsApi, investmentsApi } from "@/services/api";
import { formatCurrency, calculateProgress, calculateROI } from "@/utils/format";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [investAmount, setInvestAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, id],
    queryFn: async () => {
      const { data } = await projectsApi.getById(id);
      return data.data;
    },
    enabled: !!id,
  });

  const { data: plans } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, id, "plans"],
    queryFn: async () => {
      const { data } = await projectsApi.getPlans(id);
      return data.data;
    },
    enabled: !!id,
  });

  const investMutation = useMutation({
    mutationFn: () =>
      investmentsApi.create({
        projectId: id,
        amount: parseFloat(investAmount),
      }),
    onSuccess: () => {
      toast.success("Investment successful!");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTMENTS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      setShowConfirm(false);
      setInvestAmount("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  if (isLoading) return <CardSkeleton className="max-w-4xl" />;
  if (!project) return <div>Project not found</div>;

  const progress = calculateProgress(project.currentAmount, project.fundingGoal);
  const amount = parseFloat(investAmount) || 0;
  const expectedReturn = calculateROI(amount, project.roiPercentage);

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
        <ProjectImage src={project.image} alt={project.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <Badge variant={project.status} className="mb-2 capitalize">{project.status}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold">{project.title}</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About This Project</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.fullDescription || project.description}
              </p>
            </CardContent>
          </Card>

          {plans && plans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Investment Plans</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {plans.map((plan) => (
                  <div key={plan.id} className="glass-card p-4 space-y-2">
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-emerald-400">{plan.roiPercentage}% ROI</span>
                      <span>{plan.duration} days</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(plan.minAmount)} — {formatCurrency(plan.maxAmount)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {project.documents && project.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" /> Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {project.documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="h-4 w-4 text-primary" />
                    <span>{doc.name}</span>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {project.faqs && project.faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" /> FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  {project.faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger>{faq.question}</AccordionTrigger>
                      <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROI</span>
                <span className="text-emerald-400 font-semibold">{project.roiPercentage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Period</span>
                <span>{project.investmentPeriod} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investors</span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" /> {project.investorCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risk</span>
                <Badge variant="outline" className="capitalize">{project.riskLevel}</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{formatCurrency(project.currentAmount)}</span>
                  <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                </div>
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground text-center">
                  Goal: {formatCurrency(project.fundingGoal)}
                </p>
              </div>
            </CardContent>
          </Card>

          {project.status === "active" && (
            <Card>
              <CardHeader>
                <CardTitle>Invest Now</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Investment Amount</Label>
                  <Input
                    type="number"
                    placeholder={`Min ${formatCurrency(project.minInvestment)}`}
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                  />
                </div>
                {amount > 0 && (
                  <div className="glass-card p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected Return</span>
                      <span className="text-emerald-400">{formatCurrency(expectedReturn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Value</span>
                      <span>{formatCurrency(amount + expectedReturn)}</span>
                    </div>
                  </div>
                )}
                <Button
                  variant="gradient"
                  className="w-full"
                  disabled={amount < project.minInvestment}
                  onClick={() => setShowConfirm(true)}
                >
                  Confirm Investment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Investment</DialogTitle>
            <DialogDescription>
              You are about to invest {formatCurrency(amount)} in {project.title}.
              Expected return: {formatCurrency(expectedReturn)}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              className="flex-1"
              onClick={() => investMutation.mutate()}
              disabled={investMutation.isPending}
            >
              {investMutation.isPending ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
