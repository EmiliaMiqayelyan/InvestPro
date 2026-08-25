"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const json = Sequelize.JSON || Sequelize.TEXT;

    await queryInterface.createTable("users", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      email: { type: Sequelize.STRING(255), allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING(255), allowNull: false },
      firstName: { type: Sequelize.STRING(100), allowNull: false },
      lastName: { type: Sequelize.STRING(100), allowNull: false },
      avatar: { type: Sequelize.STRING(500), allowNull: true },
      phone: { type: Sequelize.STRING(50), allowNull: true },
      role: { type: Sequelize.STRING(32), allowNull: false },
      membershipTier: { type: Sequelize.STRING(32), allowNull: false },
      membershipExpiresAt: { type: Sequelize.DATE, allowNull: true },
      isEmailVerified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is2faEnabled: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      kycStatus: { type: Sequelize.STRING(32), allowNull: false },
      companyName: { type: Sequelize.STRING(255), allowNull: true },
      bio: { type: Sequelize.TEXT, allowNull: true },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("projects", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      ownerId: { type: Sequelize.STRING(36), allowNull: false },
      ownerName: { type: Sequelize.STRING(200), allowNull: true },
      ownerKycStatus: { type: Sequelize.STRING(32), allowNull: true },
      title: { type: Sequelize.STRING(255), allowNull: false },
      titleHy: { type: Sequelize.STRING(255), allowNull: true },
      slug: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      descriptionHy: { type: Sequelize.TEXT, allowNull: true },
      fullDescription: { type: Sequelize.TEXT, allowNull: false },
      fullDescriptionHy: { type: Sequelize.TEXT, allowNull: true },
      category: { type: Sequelize.STRING(100), allowNull: false },
      categoryHy: { type: Sequelize.STRING(100), allowNull: true },
      industry: { type: Sequelize.STRING(100), allowNull: false },
      industryHy: { type: Sequelize.STRING(100), allowNull: true },
      location: { type: Sequelize.STRING(200), allowNull: false },
      locationHy: { type: Sequelize.STRING(200), allowNull: true },
      stage: { type: Sequelize.STRING(32), allowNull: false },
      timeline: { type: Sequelize.STRING(255), allowNull: false },
      timelineHy: { type: Sequelize.STRING(255), allowNull: true },
      image: { type: Sequelize.STRING(500), allowNull: false },
      requiredInvestment: { type: Sequelize.DOUBLE, allowNull: false },
      minInvestment: { type: Sequelize.DOUBLE, allowNull: false },
      currentFunding: { type: Sequelize.DOUBLE, allowNull: false },
      views: { type: Sequelize.INTEGER, allowNull: false },
      expectedRoi: { type: Sequelize.DOUBLE, allowNull: false },
      revenueModel: { type: Sequelize.TEXT, allowNull: false },
      revenueModelHy: { type: Sequelize.TEXT, allowNull: true },
      financialProjections: { type: Sequelize.TEXT, allowNull: false },
      financialProjectionsHy: { type: Sequelize.TEXT, allowNull: true },
      investmentPlan: { type: Sequelize.TEXT, allowNull: false },
      investmentPlanHy: { type: Sequelize.TEXT, allowNull: true },
      businessModel: { type: Sequelize.TEXT, allowNull: false },
      businessModelHy: { type: Sequelize.TEXT, allowNull: true },
      budgetBreakdown: { type: json, allowNull: true },
      phases: { type: json, allowNull: false },
      riskLevel: { type: Sequelize.STRING(16), allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      investorCount: { type: Sequelize.INTEGER, allowNull: false },
      savedCount: { type: Sequelize.INTEGER, allowNull: false },
      team: { type: json, allowNull: false },
      documents: { type: json, allowNull: false },
      updates: { type: json, allowNull: false },
      startDate: { type: Sequelize.STRING(32), allowNull: true },
      endDate: { type: Sequelize.STRING(32), allowNull: true },
      submittedAt: { type: Sequelize.DATE, allowNull: true },
      approvedAt: { type: Sequelize.DATE, allowNull: true },
      approvedBy: { type: Sequelize.STRING(36), allowNull: true },
      rejectedAt: { type: Sequelize.DATE, allowNull: true },
      rejectedBy: { type: Sequelize.STRING(36), allowNull: true },
      rejectionReason: { type: Sequelize.TEXT, allowNull: true },
      reviewHistory: { type: json, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("subscriptions", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      planId: { type: Sequelize.STRING(32), allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      startedAt: { type: Sequelize.DATE, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      stripeSessionId: { type: Sequelize.STRING(255), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("offers", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      projectTitle: { type: Sequelize.STRING(255), allowNull: true },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      investorName: { type: Sequelize.STRING(200), allowNull: true },
      ownerId: { type: Sequelize.STRING(36), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      conditions: { type: Sequelize.TEXT, allowNull: false },
      questions: { type: Sequelize.TEXT, allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      ownerResponse: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("investments", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      offerId: { type: Sequelize.STRING(36), allowNull: false },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      amount: { type: Sequelize.DOUBLE, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      expectedReturn: { type: Sequelize.DOUBLE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("saved_projects", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      savedAt: { type: Sequelize.DATE, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("conversations", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      projectTitle: { type: Sequelize.STRING(255), allowNull: false },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      investorName: { type: Sequelize.STRING(200), allowNull: false },
      ownerId: { type: Sequelize.STRING(36), allowNull: false },
      ownerName: { type: Sequelize.STRING(200), allowNull: false },
      isAdminThread: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      lastMessage: { type: Sequelize.STRING(500), allowNull: true },
      lastMessageAt: { type: Sequelize.DATE, allowNull: true },
      unreadCount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("messages", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      conversationId: { type: Sequelize.STRING(36), allowNull: false },
      senderId: { type: Sequelize.STRING(36), allowNull: false },
      senderName: { type: Sequelize.STRING(200), allowNull: false },
      senderRole: { type: Sequelize.STRING(32), allowNull: false },
      content: { type: Sequelize.TEXT, allowNull: false },
      attachmentUrl: { type: Sequelize.STRING(500), allowNull: true },
      attachmentName: { type: Sequelize.STRING(255), allowNull: true },
      isFlagged: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("notifications", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      type: { type: Sequelize.STRING(32), allowNull: false },
      title: { type: Sequelize.STRING(255), allowNull: false },
      message: { type: Sequelize.TEXT, allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      href: { type: Sequelize.STRING(500), allowNull: true },
      priority: { type: Sequelize.STRING(16), allowNull: false },
      metadata: { type: json, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("kyc_submissions", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      idDocumentUrl: { type: Sequelize.STRING(500), allowNull: false },
      selfieUrl: { type: Sequelize.STRING(500), allowNull: false },
      addressProofUrl: { type: Sequelize.STRING(500), allowNull: false },
      rejectionReason: { type: Sequelize.TEXT, allowNull: true },
      submittedAt: { type: Sequelize.DATE, allowNull: false },
      reviewedAt: { type: Sequelize.DATE, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("activity_logs", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      action: { type: Sequelize.STRING(100), allowNull: false },
      entityType: { type: Sequelize.STRING(50), allowNull: false },
      entityId: { type: Sequelize.STRING(36), allowNull: true },
      metadata: { type: json, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("complaints", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      reporterId: { type: Sequelize.STRING(36), allowNull: false },
      againstUserId: { type: Sequelize.STRING(36), allowNull: true },
      projectId: { type: Sequelize.STRING(36), allowNull: true },
      subject: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("milestone_plans", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      projectId: { type: Sequelize.STRING(36), allowNull: false },
      projectTitle: { type: Sequelize.STRING(255), allowNull: true },
      investorId: { type: Sequelize.STRING(36), allowNull: false },
      investorName: { type: Sequelize.STRING(200), allowNull: true },
      ownerId: { type: Sequelize.STRING(36), allowNull: false },
      ownerName: { type: Sequelize.STRING(200), allowNull: true },
      items: { type: json, allowNull: false },
      status: { type: Sequelize.STRING(32), allowNull: false },
      notes: { type: Sequelize.TEXT, allowNull: true },
      ownerResponse: { type: Sequelize.TEXT, allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.createTable("uploaded_files", {
      id: { type: Sequelize.STRING(36), primaryKey: true },
      userId: { type: Sequelize.STRING(36), allowNull: false },
      name: { type: Sequelize.STRING(255), allowNull: false },
      url: { type: Sequelize.STRING(500), allowNull: false },
      size: { type: Sequelize.INTEGER, allowNull: false },
      category: { type: Sequelize.STRING(64), allowNull: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("users", ["email"]);
    await queryInterface.addIndex("users", ["role"]);
    await queryInterface.addIndex("projects", ["ownerId"]);
    await queryInterface.addIndex("projects", ["status"]);
    await queryInterface.addIndex("offers", ["investorId"]);
    await queryInterface.addIndex("offers", ["ownerId"]);
    await queryInterface.addIndex("notifications", ["userId"]);
  },

  async down(queryInterface) {
    const tables = [
      "uploaded_files",
      "milestone_plans",
      "complaints",
      "activity_logs",
      "kyc_submissions",
      "notifications",
      "messages",
      "conversations",
      "saved_projects",
      "investments",
      "offers",
      "subscriptions",
      "projects",
      "users",
    ];
    for (const t of tables) {
      await queryInterface.dropTable(t);
    }
  },
};
