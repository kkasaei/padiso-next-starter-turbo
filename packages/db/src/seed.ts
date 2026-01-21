import "dotenv/config";
import { db } from "./db.js";
import {
  users,
  projects,
  projectTags,
  projectMembers,
  tasks,
  workstreams,
  workstreamTasks,
  timelineTasks,
  projectScope,
  projectOutcomes,
  keyFeatures,
  files,
  fileAttachments,
  notes,
  audioNoteDataTable,
  audioNoteKeyPoints,
  audioNoteInsights,
  transcriptSegments,
} from "./schema/index";
import { eq } from "drizzle-orm";

// Import mock data - we'll need to adapt this to work from the db package
// For now, we'll define the data inline or import from a shared location

// Helper to format dates for PostgreSQL
function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]!;
}

// Helper to create user ID from name
function userIdFromName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await db.delete(transcriptSegments);
    await db.delete(audioNoteInsights);
    await db.delete(audioNoteKeyPoints);
    await db.delete(audioNoteDataTable);
    await db.delete(notes);
    await db.delete(fileAttachments);
    await db.delete(files);
    await db.delete(keyFeatures);
    await db.delete(projectOutcomes);
    await db.delete(projectScope);
    await db.delete(timelineTasks);
    await db.delete(workstreamTasks);
    await db.delete(workstreams);
    await db.delete(tasks);
    await db.delete(projectMembers);
    await db.delete(projectTags);
    await db.delete(projects);
    await db.delete(users);

    // Seed users
    console.log("👥 Seeding users...");
    const userMap = new Map<string, string>(); // name -> uuid

    const userNames = [
      "jason duong",
      "JD",
      "HP",
      "BE",
      "FE",
      "PM",
      "QA",
      "Support",
    ];

    for (const name of userNames) {
      const [user] = await db
        .insert(users)
        .values({
          name,
          avatarUrl: name === "jason duong" ? "/avatar-profile.jpg" : undefined,
          role: name === "jason duong" ? "PIC" : name.toUpperCase(),
        })
        .returning();
      if (!user) {
        throw new Error(`Failed to create user: ${name}`);
      }
      userMap.set(name.toLowerCase(), user.id);
    }

    // Seed projects from mock data
    console.log("📁 Seeding projects...");
    const projectMap = new Map<string, string>(); // original id -> uuid

    // Fixed reference date
    const _today = new Date(2024, 0, 23);
    const _base = new Date(_today.getFullYear(), _today.getMonth(), _today.getDate() - 7);
    const _d = (offsetDays: number) =>
      new Date(_base.getFullYear(), _base.getMonth(), _base.getDate() + offsetDays);

    const projectsData = [
      {
        id: "1",
        name: "Fintech Mobile App Redesign",
        taskCount: 4,
        progress: 35,
        startDate: _d(3),
        endDate: _d(27),
        status: "active" as const,
        priority: "high" as const,
        tags: ["frontend", "feature"],
        members: ["jason duong"],
        client: "Acme Bank",
        typeLabel: "MVP",
        durationLabel: "2 weeks",
        tasks: [
          {
            id: "1-1",
            name: "Discovery & IA",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(3),
            endDate: _d(10),
          },
          {
            id: "1-2",
            name: "Wireframe layout",
            assignee: "JD",
            status: "in-progress" as const,
            startDate: _d(7),
            endDate: _d(12),
          },
          {
            id: "1-3",
            name: "UI kit & visual design",
            assignee: "HP",
            status: "todo" as const,
            startDate: _d(13),
            endDate: _d(19),
          },
          {
            id: "1-4",
            name: "Prototype & handoff",
            assignee: "HP",
            status: "todo" as const,
            startDate: _d(20),
            endDate: _d(27),
          },
        ],
      },
      {
        id: "2",
        name: "Internal PM System",
        taskCount: 6,
        progress: 20,
        startDate: _d(3),
        endDate: _d(24),
        status: "active" as const,
        priority: "medium" as const,
        tags: ["backend"],
        members: ["jason duong"],
        client: "Acme Corp Internal",
        typeLabel: "Improvement",
        durationLabel: "2 weeks",
        tasks: [
          {
            id: "2-1",
            name: "Define MVP scope",
            assignee: "PM",
            status: "done" as const,
            startDate: _d(3),
            endDate: _d(5),
          },
          {
            id: "2-2",
            name: "Database schema",
            assignee: "BE",
            status: "in-progress" as const,
            startDate: _d(6),
            endDate: _d(10),
          },
          {
            id: "2-3",
            name: "API endpoints",
            assignee: "BE",
            status: "todo" as const,
            startDate: _d(11),
            endDate: _d(15),
          },
          {
            id: "2-4",
            name: "Roles & permissions",
            assignee: "BE",
            status: "todo" as const,
            startDate: _d(16),
            endDate: _d(18),
          },
          {
            id: "2-5",
            name: "UI implementation",
            assignee: "FE",
            status: "todo" as const,
            startDate: _d(19),
            endDate: _d(21),
          },
          {
            id: "2-6",
            name: "QA & rollout",
            assignee: "QA",
            status: "todo" as const,
            startDate: _d(22),
            endDate: _d(24),
          },
        ],
      },
      {
        id: "3",
        name: "AI Learning Platform",
        taskCount: 3,
        progress: 40,
        startDate: _d(14),
        endDate: _d(28),
        status: "active" as const,
        priority: "urgent" as const,
        tags: ["feature", "urgent"],
        members: ["jason duong"],
        client: "Acme Learning",
        typeLabel: "Revamp",
        durationLabel: "3 weeks",
        tasks: [
          {
            id: "3-1",
            name: "Course outline",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(14),
            endDate: _d(16),
          },
          {
            id: "3-2",
            name: "Lesson player UI",
            assignee: "HP",
            status: "in-progress" as const,
            startDate: _d(17),
            endDate: _d(23),
          },
          {
            id: "3-3",
            name: "Payment integration",
            assignee: "BE",
            status: "todo" as const,
            startDate: _d(24),
            endDate: _d(28),
          },
        ],
      },
      {
        id: "4",
        name: "Internal CRM System",
        taskCount: 4,
        progress: 0,
        startDate: _d(18),
        endDate: _d(35),
        status: "backlog" as const,
        priority: "low" as const,
        tags: ["bug"],
        members: [],
        client: "Acme Corp Internal",
        typeLabel: "New",
        durationLabel: "—",
        tasks: [
          {
            id: "4-1",
            name: "Requirements gathering",
            assignee: "PM",
            status: "todo" as const,
            startDate: _d(18),
            endDate: _d(21),
          },
          {
            id: "4-2",
            name: "Data model",
            assignee: "BE",
            status: "todo" as const,
            startDate: _d(22),
            endDate: _d(25),
          },
          {
            id: "4-3",
            name: "Core screens",
            assignee: "FE",
            status: "todo" as const,
            startDate: _d(26),
            endDate: _d(31),
          },
          {
            id: "4-4",
            name: "QA & UAT",
            assignee: "QA",
            status: "todo" as const,
            startDate: _d(32),
            endDate: _d(35),
          },
        ],
      },
      {
        id: "5",
        name: "Ecommerce website",
        taskCount: 5,
        progress: 100,
        startDate: _d(-7),
        endDate: _d(0),
        status: "completed" as const,
        priority: "medium" as const,
        tags: ["frontend"],
        members: ["jason duong"],
        client: "Acme Retail",
        typeLabel: "Audit",
        durationLabel: "1 week",
        tasks: [
          {
            id: "5-1",
            name: "IA & sitemap",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(-7),
            endDate: _d(-5),
          },
          {
            id: "5-2",
            name: "Product listing UI",
            assignee: "HP",
            status: "done" as const,
            startDate: _d(-5),
            endDate: _d(-3),
          },
          {
            id: "5-3",
            name: "Cart & checkout flow",
            assignee: "HP",
            status: "done" as const,
            startDate: _d(-3),
            endDate: _d(-1),
          },
          {
            id: "5-4",
            name: "Payment gateway",
            assignee: "BE",
            status: "done" as const,
            startDate: _d(-1),
            endDate: _d(0),
          },
          {
            id: "5-5",
            name: "Launch checklist",
            assignee: "QA",
            status: "done" as const,
            startDate: _d(-2),
            endDate: _d(0),
          },
        ],
      },
      {
        id: "6",
        name: "Marketing Site Refresh",
        taskCount: 3,
        progress: 10,
        startDate: _d(5),
        endDate: _d(18),
        status: "planned" as const,
        priority: "medium" as const,
        tags: ["frontend", "feature"],
        members: ["jason duong"],
        client: "Acme Marketing",
        typeLabel: "Phase 1",
        durationLabel: "2 weeks",
        tasks: [
          {
            id: "6-1",
            name: "Landing page layout",
            assignee: "JD",
            status: "todo" as const,
            startDate: _d(5),
            endDate: _d(9),
          },
          {
            id: "6-2",
            name: "Hero illustrations",
            assignee: "HP",
            status: "todo" as const,
            startDate: _d(10),
            endDate: _d(14),
          },
          {
            id: "6-3",
            name: "Content QA",
            assignee: "QA",
            status: "todo" as const,
            startDate: _d(15),
            endDate: _d(18),
          },
        ],
      },
      {
        id: "7",
        name: "Design System Cleanup",
        taskCount: 4,
        progress: 0,
        startDate: _d(8),
        endDate: _d(20),
        status: "planned" as const,
        priority: "low" as const,
        tags: ["backend"],
        members: ["jason duong"],
        client: "Acme Corp Internal",
        typeLabel: "Refactor",
        durationLabel: "1 week",
        tasks: [
          {
            id: "7-1",
            name: "Token audit",
            assignee: "JD",
            status: "todo" as const,
            startDate: _d(8),
            endDate: _d(10),
          },
          {
            id: "7-2",
            name: "Component inventory",
            assignee: "JD",
            status: "todo" as const,
            startDate: _d(11),
            endDate: _d(13),
          },
          {
            id: "7-3",
            name: "Deprecation plan",
            assignee: "PM",
            status: "todo" as const,
            startDate: _d(14),
            endDate: _d(17),
          },
          {
            id: "7-4",
            name: "Docs update",
            assignee: "JD",
            status: "todo" as const,
            startDate: _d(18),
            endDate: _d(20),
          },
        ],
      },
      {
        id: "8",
        name: "Onboarding Flow A/B Test",
        taskCount: 3,
        progress: 100,
        startDate: _d(-10),
        endDate: _d(-3),
        status: "completed" as const,
        priority: "high" as const,
        tags: ["feature", "urgent"],
        members: ["jason duong"],
        client: "Acme SaaS",
        typeLabel: "Experiment",
        durationLabel: "1 week",
        tasks: [
          {
            id: "8-1",
            name: "Hypothesis & metrics",
            assignee: "PM",
            status: "done" as const,
            startDate: _d(-10),
            endDate: _d(-8),
          },
          {
            id: "8-2",
            name: "Variant design",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(-8),
            endDate: _d(-5),
          },
          {
            id: "8-3",
            name: "Analysis & learnings",
            assignee: "PM",
            status: "done" as const,
            startDate: _d(-5),
            endDate: _d(-3),
          },
        ],
      },
      {
        id: "9",
        name: "Support Center Revamp",
        taskCount: 4,
        progress: 100,
        startDate: _d(-15),
        endDate: _d(-5),
        status: "completed" as const,
        priority: "medium" as const,
        tags: ["frontend"],
        members: ["jason duong"],
        client: "Acme Helpdesk",
        typeLabel: "Revamp",
        durationLabel: "2 weeks",
        tasks: [
          {
            id: "9-1",
            name: "Content IA",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(-15),
            endDate: _d(-13),
          },
          {
            id: "9-2",
            name: "Search UX",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(-13),
            endDate: _d(-10),
          },
          {
            id: "9-3",
            name: "Article template",
            assignee: "HP",
            status: "done" as const,
            startDate: _d(-10),
            endDate: _d(-7),
          },
          {
            id: "9-4",
            name: "Rollout & feedback",
            assignee: "PM",
            status: "done" as const,
            startDate: _d(-7),
            endDate: _d(-5),
          },
        ],
      },
      {
        id: "10",
        name: "Billing Dashboard Polish",
        taskCount: 2,
        progress: 100,
        startDate: _d(-6),
        endDate: _d(-1),
        status: "completed" as const,
        priority: "low" as const,
        tags: ["bug"],
        members: ["jason duong"],
        client: "Acme Finance",
        typeLabel: "Polish",
        durationLabel: "3 days",
        tasks: [
          {
            id: "10-1",
            name: "Error state review",
            assignee: "QA",
            status: "done" as const,
            startDate: _d(-6),
            endDate: _d(-4),
          },
          {
            id: "10-2",
            name: "Charts clean-up",
            assignee: "JD",
            status: "done" as const,
            startDate: _d(-3),
            endDate: _d(-1),
          },
        ],
      },
    ];

    for (const projectData of projectsData) {
      const [project] = await db
        .insert(projects)
        .values({
          name: projectData.name,
          description: projectData.client
            ? `Project for ${projectData.client}. This is mock content that will be replaced by API later.`
            : "This is mock content that will be replaced by API later.",
          taskCount: projectData.taskCount,
          progress: projectData.progress,
          startDate: formatDate(projectData.startDate),
          endDate: formatDate(projectData.endDate),
          status: projectData.status,
          priority: projectData.priority,
          client: projectData.client,
          typeLabel: projectData.typeLabel,
          durationLabel: projectData.durationLabel,
          priorityLabel: projectData.priority.charAt(0).toUpperCase() + projectData.priority.slice(1),
          locationLabel: "Australia",
          sprintLabel: projectData.typeLabel && projectData.durationLabel
            ? `${projectData.typeLabel} ${projectData.durationLabel}`
            : projectData.durationLabel ?? "MVP 2 weeks",
          lastSyncLabel: "Just now",
          backlogStatusLabel: projectData.status === "active" ? "Active" : "Backlog",
          backlogGroupLabel: "None",
          backlogPriorityLabel: projectData.priority.charAt(0).toUpperCase() + projectData.priority.slice(1),
          backlogLabelBadge: "Design",
        })
        .returning();

      if (!project) {
        throw new Error(`Failed to create project: ${projectData.name}`);
      }

      projectMap.set(projectData.id, project.id);

      // Add tags
      for (const tag of projectData.tags) {
        await db.insert(projectTags).values({
          projectId: project.id,
          tag,
        });
      }

      // Add members
      const memberList = projectData.members.length > 0 ? projectData.members : ["jason duong"];
      for (const memberName of memberList) {
        const userId = userMap.get(memberName.toLowerCase());
        if (userId) {
          await db.insert(projectMembers).values({
            projectId: project.id,
            userId,
          });
        }
      }

      // Add tasks
      for (const taskData of projectData.tasks) {
        const assigneeId = userMap.get(taskData.assignee.toLowerCase());
        await db.insert(tasks).values({
          projectId: project.id,
          name: taskData.name,
          status: taskData.status,
          assigneeId,
          startDate: formatDate(taskData.startDate),
          endDate: formatDate(taskData.endDate),
        });
      }
    }

    // Seed project details for project "1" (Fintech Mobile App Redesign)
    const project1Id = projectMap.get("1");
    const jasonUserId = userMap.get("jason duong");

    if (project1Id && jasonUserId) {
      console.log("📝 Seeding project details for project 1...");

      // Update project description
      await db
        .update(projects)
        .set({
          description:
            "The internal project aims to optimize user experience and interface for the PM System Core. The goal is to standardize UX, enhance usability, and create a design content repository for daily publication on social media.",
        })
        .where(eq(projects.id, project1Id));

      // Add scope items
      const inScopeItems = [
        "UX research (existing users, light interviews)",
        "Core flows redesign (Onboarding, Payment, Transaction history)",
        "Design system (starter components)",
        "Usability fixes for critical flows",
      ];
      const outOfScopeItems = [
        "New feature ideation",
        "Backend logic changes",
        "Marketing landing pages",
      ];

      for (const item of inScopeItems) {
        await db.insert(projectScope).values({
          projectId: project1Id,
          item,
          isInScope: true,
        });
      }
      for (const item of outOfScopeItems) {
        await db.insert(projectScope).values({
          projectId: project1Id,
          item,
          isInScope: false,
        });
      }

      // Add outcomes
      const outcomes = [
        "Reduce payment flow steps from 6 → 4",
        "Increase task success rate (usability test) from 70% → 90%",
        "Deliver production-ready UI for MVP build",
        "Enable dev handoff without design clarification loops",
      ];
      for (const outcome of outcomes) {
        await db.insert(projectOutcomes).values({
          projectId: project1Id,
          outcome,
        });
      }

      // Add key features
      const keyFeaturesData = [
        { priority: "p0", features: ["Onboarding & KYC flow", "Payment confirmation UX"] },
        { priority: "p1", features: ["Transaction history & filters", "Error / empty states"] },
        { priority: "p2", features: ["Visual polish & motion guidelines"] },
      ];
      for (const { priority, features } of keyFeaturesData) {
        for (const feature of features) {
          await db.insert(keyFeatures).values({
            projectId: project1Id,
            feature,
            priority,
          });
        }
      }

      // Add timeline tasks
      const timelineTasksData = [
        {
          name: "Audit existing flows",
          startDate: new Date(2025, 11, 22),
          endDate: new Date(2025, 11, 23),
          status: "done" as const,
        },
        {
          name: "Redesign onboarding & payment",
          startDate: new Date(2025, 11, 23),
          endDate: new Date(2025, 11, 25),
          status: "in-progress" as const,
        },
        {
          name: "Usability testing",
          startDate: new Date(2025, 11, 25),
          endDate: new Date(2025, 11, 27),
          status: "planned" as const,
        },
        {
          name: "Iterate based on feedback",
          startDate: new Date(2025, 11, 27),
          endDate: new Date(2025, 11, 28),
          status: "planned" as const,
        },
      ];
      for (const taskData of timelineTasksData) {
        await db.insert(timelineTasks).values({
          projectId: project1Id,
          name: taskData.name,
          startDate: formatDate(taskData.startDate),
          endDate: formatDate(taskData.endDate),
          status: taskData.status,
        });
      }

      // Add workstreams
      const today = new Date();
      const workstreamsData = [
        {
          name: "Processing documents for signing the deal",
          tasks: [
            {
              name: "Processing documents for signing the deal",
              status: "done" as const,
              dueLabel: "Today",
              dueTone: "muted" as const,
              assignee: "jason duong",
              startDate: today,
            },
            {
              name: "Internal approval & sign-off",
              status: "todo" as const,
              dueLabel: "Today",
              dueTone: "danger" as const,
              assignee: "jason duong",
              startDate: today,
            },
            {
              name: "Send contract to client",
              status: "todo" as const,
              dueLabel: "Tomorrow",
              dueTone: "warning" as const,
              assignee: "jason duong",
              startDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
            },
            {
              name: "Track client signature",
              status: "todo" as const,
              assignee: "jason duong",
              startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
          ],
        },
        {
          name: "Client onboarding setup",
          tasks: [
            {
              name: "Collect onboarding requirements",
              status: "in-progress" as const,
              dueLabel: "This week",
              dueTone: "muted" as const,
              assignee: "jason duong",
              startDate: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000),
            },
            {
              name: "Configure sandbox account",
              status: "todo" as const,
              assignee: "jason duong",
              startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
            },
            {
              name: "Schedule onboarding session",
              status: "todo" as const,
              assignee: "jason duong",
              startDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
            },
          ],
        },
      ];

      for (const workstreamData of workstreamsData) {
        const [workstream] = await db
          .insert(workstreams)
          .values({
            projectId: project1Id,
            name: workstreamData.name,
          })
          .returning();

        if (!workstream) {
          throw new Error(`Failed to create workstream: ${workstreamData.name}`);
        }

        for (const taskData of workstreamData.tasks) {
          const assigneeId = userMap.get(taskData.assignee.toLowerCase());
          const [task] = await db
            .insert(tasks)
            .values({
              projectId: project1Id,
              name: taskData.name,
              status: taskData.status,
              assigneeId,
              startDate: formatDate(taskData.startDate),
              dueLabel: taskData.dueLabel,
              dueTone: taskData.dueTone,
            })
            .returning();

          if (!task) {
            throw new Error(`Failed to create task: ${taskData.name}`);
          }

          await db.insert(workstreamTasks).values({
            workstreamId: workstream.id,
            taskId: task.id,
          });
        }
      }

      // Add files
      const filesBaseDate = new Date(2024, 8, 18);
      const filesData = [
        { name: "Proposal.pdf", type: "pdf" as const, sizeMB: 13.0 },
        { name: "Wireframe Layout.zip", type: "zip" as const, sizeMB: 13.0 },
        { name: "Design system.fig", type: "fig" as const, sizeMB: 13.0 },
        { name: "UI Kit.fig", type: "fig" as const, sizeMB: 13.0 },
        { name: "Asset.pdf", type: "pdf" as const, sizeMB: 13.0 },
        { name: "Asset.pdf", type: "pdf" as const, sizeMB: 13.0 },
      ];

      for (const fileData of filesData) {
        await db.insert(files).values({
          projectId: project1Id,
          name: fileData.name,
          type: fileData.type,
          sizeMB: fileData.sizeMB,
          url: "#",
          addedById: jasonUserId,
          addedDate: filesBaseDate,
        });
      }

      // Add notes
      const notesData = [
        {
          title: "Project review",
          noteType: "audio" as const,
          status: "completed" as const,
          addedDate: new Date(2025, 6, 12),
          content: null,
          audioData: {
            duration: "00:02:21",
            fileName: "project-review-meeting.mp3",
            aiSummary:
              "The meeting involved a review of ongoing projects and the planning of next steps. The team discussed user testing for the week to gather feedback before deciding on new features and tasks for the next phase. Contract payments and design considerations for the landing page were also addressed.",
            keyPoints: [
              "User testing scheduled for this week",
              "New features to be decided after feedback",
              "Contract payment timeline confirmed",
              "Landing page design in progress",
            ],
            insights: [
              "Team alignment on priorities is strong",
              "Need more clarity on feature scope",
              "Design review needed before development",
            ],
            transcript: [
              {
                speaker: "SPK_1",
                timestamp: "0:00",
                text: "Co-founder should be joining on in a sec, but I kind of caught him up to speed on what we talked about last time.",
              },
              {
                speaker: "SPK_2",
                timestamp: "0:15",
                text: "Kind of where Bino is, what type of help we ideally are looking for and then you know, if you are interested, a type of work trial moving forward, what that would look like.",
              },
              {
                speaker: "SPK_1",
                timestamp: "0:22",
                text: "So today, really hoping to kind of go through some of those details and also like, if you have any insights on Bino as well as some design and suggestions that you have, we'd love to kind of talk through those as well.",
              },
              {
                speaker: "SPK_2",
                timestamp: "0:38",
                text: "Okay, sure.",
              },
              {
                speaker: "SPK_3",
                timestamp: "0:43",
                text: "Sounds good.",
              },
              {
                speaker: "SPK_1",
                timestamp: "0:55",
                text: "So yeah, we can give him a sec.",
              },
              {
                speaker: "SPK_2",
                timestamp: "1:00",
                text: "I think he should be drawing, but he doesn't.",
              },
            ],
          },
        },
        {
          title: "Meeting note",
          noteType: "meeting" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 18),
          content: "Discussion about current sprint goals, open issues, and next steps for the design handoff.",
        },
        {
          title: "Client feedback",
          noteType: "general" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 18),
          content:
            "Client shared feedback on the latest homepage iteration. Main concern is clarity of the hero copy.",
        },
        {
          title: "Internal brainstorm",
          noteType: "general" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 17),
          content:
            "Ideas for onboarding improvements, including checklists, progress indicators, and inline tips.",
        },
        {
          title: "Hero Description",
          noteType: "general" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 17),
          content: "Copy options for the hero section headline and supporting description for A/B testing.",
        },
        {
          title: "Trade-off",
          noteType: "meeting" as const,
          status: "processing" as const,
          addedDate: new Date(2024, 8, 17),
          content:
            "Notes about trade-offs between performance and flexibility for the new dashboard widgets.",
        },
        {
          title: "Roadmap",
          noteType: "general" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 16),
          content:
            "High-level roadmap for the next two quarters focusing on analytics and collaboration features.",
        },
        {
          title: "Brainstorm",
          noteType: "general" as const,
          status: "completed" as const,
          addedDate: new Date(2024, 8, 16),
          content: "Rough brainstorming around potential integrations and automation opportunities.",
        },
      ];

      for (const noteData of notesData) {
        const [note] = await db
          .insert(notes)
          .values({
            projectId: project1Id,
            title: noteData.title,
            content: noteData.content ?? null,
            noteType: noteData.noteType,
            status: noteData.status,
            addedById: jasonUserId,
            addedDate: noteData.addedDate,
          })
          .returning();

        if (!note) {
          throw new Error(`Failed to create note: ${noteData.title}`);
        }

        if (noteData.audioData) {
          const [audioNote] = await db
            .insert(audioNoteDataTable)
            .values({
              noteId: note.id,
              duration: noteData.audioData.duration,
              fileName: noteData.audioData.fileName,
              aiSummary: noteData.audioData.aiSummary,
            })
            .returning();

          if (!audioNote) {
            throw new Error(`Failed to create audio note for: ${noteData.title}`);
          }

          for (const keyPoint of noteData.audioData.keyPoints) {
            await db.insert(audioNoteKeyPoints).values({
              audioNoteId: audioNote.id,
              keyPoint,
            });
          }

          for (const insight of noteData.audioData.insights) {
            await db.insert(audioNoteInsights).values({
              audioNoteId: audioNote.id,
              insight,
            });
          }

          for (let i = 0; i < noteData.audioData.transcript.length; i++) {
            const segment = noteData.audioData.transcript[i];
            if (!segment) {
              throw new Error(`Failed to get transcript segment at index ${i}`);
            }
            await db.insert(transcriptSegments).values({
              audioNoteId: audioNote.id,
              speaker: segment.speaker,
              timestamp: segment.timestamp,
              text: segment.text,
              segmentOrder: i,
            });
          }
        }
      }
    }

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run seed if called directly
seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });

export { seed };
