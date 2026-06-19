"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectImage } from "@/components/shared/project-image";
import { ROUTES } from "@/constants";
import { formatCurrency, calculateProgress } from "@/utils/format";
import type { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  const progress = calculateProgress(project.currentAmount, project.fundingGoal);

  return (
    <Card className="overflow-hidden hover:border-primary/30 transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        <ProjectImage
          src={project.image}
          alt={project.title}
          className="group-hover:scale-105 transition-transform duration-300"
        />
        <Badge variant={project.status} className="absolute top-3 right-3 capitalize">
          {project.status}
        </Badge>
      </div>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{project.category}</Badge>
          <span className="text-sm text-emerald-400 font-semibold">
            {project.roiPercentage}% ROI
          </span>
        </div>
        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>{formatCurrency(project.currentAmount)} raised</span>
            <span className="text-muted-foreground">of {formatCurrency(project.fundingGoal)}</span>
          </div>
          <Progress value={progress} />
        </div>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" /> {project.investorCount} investors
          </span>
          <span>{project.investmentPeriod} days</span>
          <span className="capitalize">{project.riskLevel} risk</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="gradient" className="w-full" asChild>
          <Link href={`${ROUTES.PROJECTS}/${project.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
