"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const json = Sequelize.JSON || Sequelize.TEXT;

    // --- User lifecycle fields ---
    await queryInterface.addColumn("users", "status", {
      type: Sequelize.STRING(32),
      allowNull: false,
      defaultValue: "registered",
    });
    await queryInterface.addColumn("users", "emailVerifiedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "lastLoginAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("users", "isSuperAdmin", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn("users", "totpSecret", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    // --- Project spec fields ---
    await queryInterface.addColumn("projects", "country", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "maximumInvestment", {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "investmentTerm", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("projects", "publishedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // --- Offer expiry ---
    await queryInterface.addColumn("offers", "expiresAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("offers", "proposedTerms", {
      type: json,
      allowNull: true,
    });

    // --- Investment deal fields ---
    await queryInterface.addColumn("investments", "platformFee", {
      type: Sequelize.DOUBLE,
      allowNull: false,
      defaultValue: 0,
    });
    await queryInterface.addColumn("investments", "totalAmount", {
      type: Sequelize.DOUBLE,
      allowNull: true,
    });
    await queryInterface.addColumn("investments", "investmentTerm", {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn("investments", "agreementId", {
      type: Sequelize.STRING(36),
      allowNull: true,
    });
    await queryInterface.addColumn("investments", "fundedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("investments", "completedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.createTable("investor_profiles", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      firstName: { type: Sequelize.STRING(100), allowNull: true },
      lastName: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      dateOfBirth: { type: Sequelize.DATEONLY, allowNull: true },
      investmentExperience: { type: Sequelize.STRING(50), allowNull: true },
      riskLevel: { type: Sequelize.STRING(16), allowNull: true },
      verificationStatus: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("company_profiles", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false, unique: true },
      companyName: { type: Sequelize.STRING(255), allowNull: false },
      registrationNumber: { type: Sequelize.STRING(100), allowNull: true },
      country: { type: Sequelize.STRING(100), allowNull: true },
      legalAddress: { type: Sequelize.TEXT, allowNull: true },
      website: { type: Sequelize.STRING(500), allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: true },
      verificationStatus: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("investment_deals", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      offerId: { type: Sequelize.STRING(36), allowNull: true },
      principalAmount: { type: Sequelize.DOUBLE, allowNull: false },
      platformFee: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      totalAmount: { type: Sequelize.DOUBLE, allowNull: false },
      expectedReturn: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      investmentTerm: { type: Sequelize.STRING(100), allowNull: true },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "draft" },
      agreementId: { type: Sequelize.STRING(36), allowNull: true },
      fundedAt: { type: Sequelize.DATE, allowNull: true },
      completedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("wallets", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: "USD" },
      availableBalance: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      pendingBalance: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      investedBalance: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("ledger_transactions", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      walletId: { type: Sequelize.STRING(36), allowNull: false },
      type: { type: Sequelize.STRING(32), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: "USD" },
      referenceType: { type: Sequelize.STRING(50), allowNull: true },
      referenceId: { type: Sequelize.STRING(36), allowNull: true },
      balanceBefore: { type: Sequelize.DOUBLE, allowNull: false },
      balanceAfter: { type: Sequelize.DOUBLE, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "completed" },
      description: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("payments", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      walletId: { type: Sequelize.STRING(36), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: "USD" },
      provider: { type: Sequelize.STRING(50), allowNull: false, defaultValue: "internal" },
      providerTransactionId: { type: Sequelize.STRING(255), allowNull: true },
      type: { type: Sequelize.STRING(32), allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      completedAt: { type: Sequelize.DATE, allowNull: true },
    });

    await queryInterface.createTable("withdrawals", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      walletId: { type: Sequelize.STRING(36), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: "USD" },
      destination: { type: json, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      approvedBy: { type: Sequelize.STRING(36), allowNull: true },
      processedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("returns", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      investmentId: { type: Sequelize.STRING(36), allowNull: false },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      principalAmount: { type: Sequelize.DOUBLE, allowNull: false },
      returnAmount: { type: Sequelize.DOUBLE, allowNull: false },
      feeAmount: { type: Sequelize.DOUBLE, allowNull: false, defaultValue: 0 },
      netAmount: { type: Sequelize.DOUBLE, allowNull: false },
      periodStart: { type: Sequelize.DATE, allowNull: true },
      periodEnd: { type: Sequelize.DATE, allowNull: true },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      paidAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("documents", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      ownerType: { type: Sequelize.STRING(50), allowNull: false },
      ownerId: { type: Sequelize.STRING(36), allowNull: false },
      documentType: { type: Sequelize.STRING(50), allowNull: false },
      fileUrl: { type: Sequelize.STRING(500), allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      verifiedBy: { type: Sequelize.STRING(36), allowNull: true },
      verifiedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("reviews", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      companyId: { type: Sequelize.STRING(36), allowNull: false },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      comment: { type: Sequelize.TEXT, allowNull: true },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "published" },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("disputes", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      reporterId: { type: Sequelize.STRING(36), allowNull: false },
      againstUserId: { type: Sequelize.STRING(36), allowNull: true },
      projectId: { type: Sequelize.STRING(36), allowNull: true },
      investmentId: { type: Sequelize.STRING(36), allowNull: true },
      subject: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "open" },
      resolution: { type: Sequelize.TEXT, allowNull: true },
      resolvedBy: { type: Sequelize.STRING(36), allowNull: true },
      resolvedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("audit_logs", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      actorId: { type: Sequelize.STRING(36), allowNull: true },
      action: { type: Sequelize.STRING(100), allowNull: false },
      entityType: { type: Sequelize.STRING(50), allowNull: false },
      entityId: { type: Sequelize.STRING(36), allowNull: true },
      oldData: { type: json, allowNull: true },
      newData: { type: json, allowNull: true },
      ipAddress: { type: Sequelize.STRING(45), allowNull: true },
      userAgent: { type: Sequelize.STRING(500), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("idempotency_keys", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      key: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      operation: { type: Sequelize.STRING(50), allowNull: false },
      response: { type: json, allowNull: true },
      statusCode: { type: Sequelize.INTEGER, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("refresh_tokens", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      tokenHash: { type: Sequelize.STRING(255), allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      revokedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("auth_tokens", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      type: { type: Sequelize.STRING(32), allowNull: false },
      tokenHash: { type: Sequelize.STRING(255), allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      usedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("kyb_submissions", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      companyProfileId: { type: Sequelize.STRING(36), allowNull: true },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      registrationDocumentUrl: { type: Sequelize.STRING(500), allowNull: false },
      taxDocumentUrl: { type: Sequelize.STRING(500), allowNull: true },
      bankStatementUrl: { type: Sequelize.STRING(500), allowNull: true },
      rejectionReason: { type: Sequelize.TEXT, allowNull: true },
      submittedAt: { type: Sequelize.DATE, allowNull: false },
      reviewedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("system_settings", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      key: { type: Sequelize.STRING(100), allowNull: false, unique: true },
      value: { type: json, allowNull: false },
      updatedBy: { type: Sequelize.STRING(36), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("job_queue", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      queue: { type: Sequelize.STRING(50), allowNull: false },
      payload: { type: json, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false, defaultValue: "pending" },
      attempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      maxAttempts: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 3 },
      scheduledAt: { type: Sequelize.DATE, allowNull: false },
      processedAt: { type: Sequelize.DATE, allowNull: true },
      error: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
    });

    // Indexes
    await queryInterface.addIndex("wallets", ["userId"]);
    await queryInterface.addIndex("wallets", ["userId", "currency"], { unique: true });
    await queryInterface.addIndex("ledger_transactions", ["walletId"]);
    await queryInterface.addIndex("ledger_transactions", ["referenceType", "referenceId"]);
    await queryInterface.addIndex("payments", ["userId"]);
    await queryInterface.addIndex("payments", ["status"]);
    await queryInterface.addIndex("withdrawals", ["userId"]);
    await queryInterface.addIndex("withdrawals", ["status"]);
    await queryInterface.addIndex("returns", ["investorId"]);
    await queryInterface.addIndex("returns", ["investmentId"]);
    await queryInterface.addIndex("investment_deals", ["investorId"]);
    await queryInterface.addIndex("investment_deals", ["projectId"]);
    await queryInterface.addIndex("investment_deals", ["status"]);
    await queryInterface.addIndex("documents", ["ownerType", "ownerId"]);
    await queryInterface.addIndex("reviews", ["projectId"]);
    await queryInterface.addIndex("disputes", ["status"]);
    await queryInterface.addIndex("audit_logs", ["actorId"]);
    await queryInterface.addIndex("audit_logs", ["entityType", "entityId"]);
    await queryInterface.addIndex("idempotency_keys", ["key"]);
    await queryInterface.addIndex("refresh_tokens", ["userId"]);
    await queryInterface.addIndex("auth_tokens", ["userId", "type"]);
    await queryInterface.addIndex("job_queue", ["queue", "status", "scheduledAt"]);
  },

  async down(queryInterface) {
    const tables = [
      "job_queue",
      "system_settings",
      "kyb_submissions",
      "auth_tokens",
      "refresh_tokens",
      "idempotency_keys",
      "audit_logs",
      "disputes",
      "reviews",
      "documents",
      "returns",
      "withdrawals",
      "payments",
      "ledger_transactions",
      "wallets",
      "investment_deals",
      "company_profiles",
      "investor_profiles",
    ];
    for (const t of tables) {
      await queryInterface.dropTable(t);
    }

    const userCols = ["status", "emailVerifiedAt", "lastLoginAt", "isSuperAdmin", "totpSecret"];
    for (const c of userCols) {
      await queryInterface.removeColumn("users", c);
    }
    const projectCols = ["country", "maximumInvestment", "investmentTerm", "publishedAt"];
    for (const c of projectCols) {
      await queryInterface.removeColumn("projects", c);
    }
    await queryInterface.removeColumn("offers", "expiresAt");
    await queryInterface.removeColumn("offers", "proposedTerms");
    const investCols = [
      "platformFee",
      "totalAmount",
      "investmentTerm",
      "agreementId",
      "fundedAt",
      "completedAt",
    ];
    for (const c of investCols) {
      await queryInterface.removeColumn("investments", c);
    }
  },
};
