import type {
  UserProfile,
  MembershipPlan,
  Trainer,
  FitnessClass,
  Booking,
  WorkoutRoutine,
  ProgressEntry,
  AppNotification,
  Review
} from "@/types";

export const MOCK_USERS: Record<string, UserProfile> = {
  admin: {
    uid: "usr_admin_001",
    email: "admin@ironyxfitness.com",
    displayName: "Marcus Vance",
    photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    phoneNumber: "+1 (555) 892-4411",
    role: "admin",
    status: "active",
    createdAt: "2025-01-10T08:00:00.000Z",
    updatedAt: "2026-03-01T10:30:00.000Z",
    metadata: {
      fitnessGoal: "Executive Oversight & Peak Conditioning",
      heightCm: 188,
      weightKg: 89
    }
  },
  trainer: {
    uid: "usr_trainer_001",
    email: "alex.thorne@ironyxfitness.com",
    displayName: "Alex 'Titan' Thorne",
    photoURL: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
    phoneNumber: "+1 (555) 723-9090",
    role: "trainer",
    status: "active",
    createdAt: "2025-02-15T09:00:00.000Z",
    updatedAt: "2026-03-02T12:00:00.000Z",
    metadata: {
      fitnessGoal: "Hypertrophy & Biomechanical Optimization",
      heightCm: 185,
      weightKg: 94
    }
  },
  member: {
    uid: "usr_member_001",
    email: "sarah.connor@ironyxfitness.com",
    displayName: "Sarah Jenkins",
    photoURL: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    phoneNumber: "+1 (555) 431-8822",
    role: "member",
    status: "active",
    membershipId: "plan_titan_all_access",
    createdAt: "2025-06-01T10:00:00.000Z",
    updatedAt: "2026-03-05T08:15:00.000Z",
    metadata: {
      gender: "female",
      fitnessGoal: "Athletic Conditioning & Olympic Lifting",
      heightCm: 172,
      weightKg: 64,
      emergencyContact: {
        name: "David Jenkins",
        phone: "+1 (555) 431-8899",
        relation: "Spouse"
      }
    }
  }
};

export const MOCK_PLANS: MembershipPlan[] = [
  {
    id: "plan_starter",
    name: "Foundation",
    slug: "foundation",
    tier: "starter",
    tagline: "Essential access for disciplined solo athletes.",
    priceMonthly: 79,
    priceAnnual: 790,
    features: [
      "Full 24/7 Gym Floor & Heavy Iron Access",
      "Digital Locker & Secure Keyless Entry",
      "IRONX Mobile App & Set Logger",
      "2 Group Fitness Class Credits / Month",
      "Standard Recovery Suite Access"
    ],
    isFeatured: false,
    classCreditsPerMonth: 2,
    guestPassesPerMonth: 1,
    saunaAndRecoveryAccess: false,
    personalTrainerSessions: 0,
    status: "published"
  },
  {
    id: "plan_pro",
    name: "Pro Athlete",
    slug: "pro-athlete",
    tier: "pro",
    tagline: "The premier tier for dedicated functional fitness & strength.",
    priceMonthly: 149,
    priceAnnual: 1490,
    features: [
      "Unlimited Master Group Classes & HIIT Studios",
      "Full Cryotherapy & Infrared Sauna Access",
      "Quarterly InBody 770 Composition Scan",
      "1 Complimentary 1-on-1 PT Session per Month",
      "Custom Macro & Nutrition Plan Builder",
      "Priority Lane Booking (48h in advance)"
    ],
    isFeatured: true,
    classCreditsPerMonth: -1, // unlimited
    guestPassesPerMonth: 3,
    saunaAndRecoveryAccess: true,
    personalTrainerSessions: 1,
    status: "published"
  },
  {
    id: "plan_titan_all_access",
    name: "Titan All-Access",
    slug: "titan-all-access",
    tier: "titan-all-access",
    tagline: "Unrestricted luxury access to all international IRONX centers.",
    priceMonthly: 249,
    priceAnnual: 2490,
    features: [
      "Global Multi-Location Access & Private Valet",
      "Unlimited Classes, Boxing Ring & Turf Arena",
      "Weekly 1-on-1 Dedicated Master Coaching",
      "Hyperbaric Oxygen & Cold Plunge Lounges",
      "Complimentary IRONX Athletic Apparel Pack",
      "Dedicated Private Locker with Laundry Service",
      "Unlimited Guest Passes (Accompanied)"
    ],
    isFeatured: false,
    classCreditsPerMonth: -1,
    guestPassesPerMonth: 10,
    saunaAndRecoveryAccess: true,
    personalTrainerSessions: 4,
    status: "published"
  }
];

export const MOCK_TRAINERS: Trainer[] = [
  {
    id: "trn_001",
    userId: "usr_trainer_001",
    fullName: "Alex 'Titan' Thorne",
    slug: "alex-thorne",
    title: "Director of High Performance & Powerlifting",
    bio: "Former national powerlifting champion with 12+ years optimizing human kinematics, neuromuscular efficiency, and barbell mastery.",
    specialties: ["Olympic Weightlifting", "Powerlifting", "Biomechanical Alignment", "Hypertrophy"],
    experienceYears: 12,
    certifications: ["CSCS (NSCA)", "USAW Level 3 Senior Coach", "FRC Mobility Specialist"],
    avatarUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80",
    rating: 4.98,
    totalReviews: 142,
    isFeatured: true,
    weeklyAvailableHours: 35
  },
  {
    id: "trn_002",
    userId: "usr_trainer_002",
    fullName: "Elena Rostova",
    slug: "elena-rostova",
    title: "Head of Metabolic Conditioning & Boxing",
    bio: "Ex-Olympic combat athlete specializing in explosive cardiovascular stamina, rotational power, and elite agility drills.",
    specialties: ["Boxing & Kickboxing", "MetCon / HIIT", "Agility Conditioning", "Core Dynamics"],
    experienceYears: 9,
    certifications: ["NASM-PES", "Kettlebell Athletics Master", "CrossFit Level 3"],
    avatarUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=800&q=80",
    rating: 4.95,
    totalReviews: 118,
    isFeatured: true,
    weeklyAvailableHours: 30
  },
  {
    id: "trn_003",
    userId: "usr_trainer_003",
    fullName: "Marcus Sterling",
    slug: "marcus-sterling",
    title: "Lead Mobility & Active Recovery Specialist",
    bio: "Physical therapy background focused on joint longevity, spine decompression, and neuromuscular restorative movement.",
    specialties: ["Functional Range Conditioning", "Spine Health", "Post-Rehab Conditioning", "Vinyasa Flow"],
    experienceYears: 11,
    certifications: ["DPT (Doctor of Physical Therapy)", "FMS Level 2", "E-RYT 500"],
    avatarUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
    rating: 4.99,
    totalReviews: 96,
    isFeatured: true,
    weeklyAvailableHours: 28
  },
  {
    id: "trn_004",
    userId: "usr_trainer_004",
    fullName: "Kendra Blake",
    slug: "kendra-blake",
    title: "Strength & Sprint Performance Coach",
    bio: "Division 1 Track & Field strength coach dedicated to maximum velocity sprinting mechanics, plyometrics, and lean muscle synthesis.",
    specialties: ["Sprint Mechanics", "Plyometrics", "Female Athlete Physiology", "Glute & Posterior Chain"],
    experienceYears: 8,
    certifications: ["NSCA-CPT", "EXOS Performance Specialist", "Precision Nutrition Level 2"],
    avatarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80",
    rating: 4.92,
    totalReviews: 84,
    isFeatured: true,
    weeklyAvailableHours: 32
  }
];

export const MOCK_CLASSES: FitnessClass[] = [
  {
    id: "cls_001",
    title: "APEX Hypertrophy Protocol",
    description: "High-intensity progressive resistance training targeting peak muscle activation, mechanical tension, and strict tempo discipline.",
    category: "strength",
    intensity: "advanced",
    trainerId: "trn_001",
    trainerName: "Alex 'Titan' Thorne",
    trainerAvatar: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=400&q=80",
    durationMinutes: 60,
    capacity: 16,
    bookedCount: 14,
    room: "Zone A: Heavy Iron Vault",
    scheduleDays: [1, 3, 5], // Mon, Wed, Fri
    startTime: "07:00 AM",
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80",
    calorieBurnEstimate: 620,
    status: "active"
  },
  {
    id: "cls_002",
    title: "IronX Combat & Strike Conditioning",
    description: "Dynamic heavy bag combinations, footwork ladder drills, and core rotational torque for elite metabolic output.",
    category: "boxing",
    intensity: "intermediate",
    trainerId: "trn_002",
    trainerName: "Elena Rostova",
    trainerAvatar: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=400&q=80",
    durationMinutes: 50,
    capacity: 20,
    bookedCount: 18,
    room: "Studio B: Combat Octagon",
    scheduleDays: [1, 2, 4, 6], // Mon, Tue, Thu, Sat
    startTime: "08:30 AM",
    imageUrl: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80",
    calorieBurnEstimate: 750,
    status: "active"
  },
  {
    id: "cls_003",
    title: "Kinetic Mobility & Joint Reset",
    description: "Controlled articular rotations, myofascial release, and passive-to-active flexibility to restore full joint capacity.",
    category: "mobility",
    intensity: "all-levels",
    trainerId: "trn_003",
    trainerName: "Marcus Sterling",
    trainerAvatar: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80",
    durationMinutes: 45,
    capacity: 22,
    bookedCount: 12,
    room: "Studio C: Zen Sanctuary",
    scheduleDays: [0, 2, 4, 6], // Sun, Tue, Thu, Sat
    startTime: "10:00 AM",
    imageUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    calorieBurnEstimate: 310,
    status: "active"
  },
  {
    id: "cls_004",
    title: "Inferno HIIT & Turf Sprints",
    description: "Prowler sled pushes, SkiErg intervals, assault bike sprints, and kettlebell clean & press circuits.",
    category: "hiit",
    intensity: "advanced",
    trainerId: "trn_004",
    trainerName: "Kendra Blake",
    trainerAvatar: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    durationMinutes: 45,
    capacity: 18,
    bookedCount: 18,
    room: "Turf Zone: Speed Track",
    scheduleDays: [1, 3, 5],
    startTime: "05:30 PM",
    imageUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    calorieBurnEstimate: 800,
    status: "full"
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "bk_001",
    classId: "cls_001",
    className: "APEX Hypertrophy Protocol",
    classCategory: "strength",
    trainerName: "Alex 'Titan' Thorne",
    userId: "usr_member_001",
    userName: "Sarah Jenkins",
    userEmail: "sarah.connor@ironyxfitness.com",
    bookingDate: "2026-03-10",
    startTime: "07:00 AM",
    room: "Zone A: Heavy Iron Vault",
    status: "confirmed",
    bookedAt: "2026-03-04T14:32:00.000Z",
    checkInCode: "IRX-9821"
  },
  {
    id: "bk_002",
    classId: "cls_002",
    className: "IronX Combat & Strike Conditioning",
    classCategory: "boxing",
    trainerName: "Elena Rostova",
    userId: "usr_member_001",
    userName: "Sarah Jenkins",
    userEmail: "sarah.connor@ironyxfitness.com",
    bookingDate: "2026-03-12",
    startTime: "08:30 AM",
    room: "Studio B: Combat Octagon",
    status: "confirmed",
    bookedAt: "2026-03-05T09:10:00.000Z",
    checkInCode: "IRX-4412"
  },
  {
    id: "bk_003",
    classId: "cls_003",
    className: "Kinetic Mobility & Joint Reset",
    classCategory: "mobility",
    trainerName: "Marcus Sterling",
    userId: "usr_member_001",
    userName: "Sarah Jenkins",
    userEmail: "sarah.connor@ironyxfitness.com",
    bookingDate: "2026-03-01",
    startTime: "10:00 AM",
    room: "Studio C: Zen Sanctuary",
    status: "attended",
    bookedAt: "2026-02-28T16:20:00.000Z",
    checkedInAt: "2026-03-01T09:55:00.000Z",
    checkInCode: "IRX-1193"
  }
];

export const MOCK_WORKOUTS: WorkoutRoutine[] = [
  {
    id: "wo_001",
    title: "Upper Body Power & Hypertrophy Split",
    description: "Designed for explosive upper body recruitment with emphasis on chest, lat width, and shoulder stabilization.",
    difficulty: "elite",
    targetMuscleGroup: ["Chest", "Lats", "Deltoids", "Triceps"],
    estimatedDurationMinutes: 65,
    createdBy: "trn_001",
    trainerName: "Alex 'Titan' Thorne",
    assignedToUserIds: ["usr_member_001"],
    tags: ["Hypertrophy", "Upper Split", "Compound"],
    exercises: [
      {
        id: "ex_01",
        name: "Barbell Incline Bench Press",
        category: "chest",
        equipment: "barbell",
        sets: 4,
        reps: "6-8",
        targetRPE: 8.5,
        restSeconds: 120,
        notes: "Retract scapulae, touch upper chest smoothly, explode upward."
      },
      {
        id: "ex_02",
        name: "Weighted Neutral Grip Pull-Ups",
        category: "back",
        equipment: "bodyweight",
        sets: 4,
        reps: "8-10",
        targetRPE: 8.0,
        restSeconds: 90,
        notes: "Full dead hang at bottom, drive elbows down to hips."
      },
      {
        id: "ex_03",
        name: "Standing Dumbbell Overhead Press",
        category: "shoulders",
        equipment: "dumbbell",
        sets: 3,
        reps: "10-12",
        targetRPE: 8.0,
        restSeconds: 75,
        notes: "Brace glutes and core, avoid excessive lumbar arching."
      },
      {
        id: "ex_04",
        name: "Cable Rope Tricep Pressdowns",
        category: "arms",
        equipment: "cable",
        sets: 3,
        reps: "12-15",
        targetRPE: 9.0,
        restSeconds: 60,
        notes: "Flare rope outward at the bottom peak contraction."
      }
    ]
  }
];

export const MOCK_PROGRESS: ProgressEntry[] = [
  { id: "prg_01", userId: "usr_member_001", date: "2025-11-01", weightKg: 67.5, bodyFatPercentage: 21.2, benchPressMaxKg: 65, squatMaxKg: 95, deadliftMaxKg: 120 },
  { id: "prg_02", userId: "usr_member_001", date: "2025-12-01", weightKg: 66.8, bodyFatPercentage: 20.4, benchPressMaxKg: 70, squatMaxKg: 100, deadliftMaxKg: 125 },
  { id: "prg_03", userId: "usr_member_001", date: "2026-01-01", weightKg: 65.9, bodyFatPercentage: 19.5, benchPressMaxKg: 72.5, squatMaxKg: 105, deadliftMaxKg: 130 },
  { id: "prg_04", userId: "usr_member_001", date: "2026-02-01", weightKg: 65.0, bodyFatPercentage: 18.8, benchPressMaxKg: 75, squatMaxKg: 110, deadliftMaxKg: 135 },
  { id: "prg_05", userId: "usr_member_001", date: "2026-03-01", weightKg: 64.2, bodyFatPercentage: 18.0, benchPressMaxKg: 77.5, squatMaxKg: 115, deadliftMaxKg: 140 }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif_01",
    userId: "usr_member_001",
    title: "Class Reserved: APEX Hypertrophy",
    message: "Your spot is confirmed for Tuesday at 07:00 AM in Zone A with Coach Alex.",
    type: "booking",
    link: "/member/bookings",
    read: false,
    createdAt: "2026-03-05T09:12:00.000Z"
  },
  {
    id: "notif_02",
    userId: "usr_member_001",
    title: "New Workout Assigned",
    message: "Coach Alex updated your Upper Body Power routine. Check your exercise logs.",
    type: "workout",
    link: "/member/workouts",
    read: true,
    createdAt: "2026-03-04T16:00:00.000Z"
  },
  {
    id: "notif_03",
    userId: "usr_member_001",
    title: "Monthly InBody Scan Available",
    message: "Your complimentary Pro Tier body composition assessment is ready to schedule.",
    type: "membership",
    link: "/member/progress",
    read: true,
    createdAt: "2026-03-01T08:00:00.000Z"
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: "rev_01",
    userId: "usr_092",
    userName: "Jonathan Reed",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "The athletic atmosphere at IRONX is unmatched. Elite equipment, immaculate recovery facilities, and coaching that fundamentally changed my deadlift kinematics.",
    category: "facility",
    isApproved: true,
    createdAt: "2026-02-20T11:00:00.000Z"
  },
  {
    id: "rev_02",
    userId: "usr_093",
    userName: "Samantha Rivera",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "Elena's boxing conditioning is ferocious. In 3 months I've dropped 6% body fat while gaining serious core power and conditioning.",
    category: "class",
    isApproved: true,
    createdAt: "2026-02-25T14:30:00.000Z"
  },
  {
    id: "rev_03",
    userId: "usr_094",
    userName: "Liam O'Connor",
    userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
    comment: "The sauna, cold plunge, and contrast therapy suites make all the difference for training volume. This is truly the gold standard of high-performance gyms.",
    category: "overall",
    isApproved: true,
    createdAt: "2026-03-01T17:15:00.000Z"
  }
];
