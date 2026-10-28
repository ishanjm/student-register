export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  course: string;
  year: string;
  status: "Active" | "Pending" | "Suspended" | "Graduated";
  enrolledDate: string;
  gpa: number;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  guardianName?: string;
  bio?: string;
}

export const INITIAL_STUDENTS: Student[] = [
  {
    id: "STU-2026-001",
    name: "Aiden Montgomery",
    email: "aiden.m@university.edu",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    course: "Computer Science",
    year: "Year 3",
    status: "Active",
    enrolledDate: "2024-09-01",
    gpa: 3.88,
    dateOfBirth: "2004-03-14",
    address: "742 Evergreen Terrace, Springfield, OR",
    guardianName: "David Montgomery",
    emergencyContact: "+1 (555) 987-6543",
    bio: "Passionate about distributed systems, artificial intelligence, and open-source software engineering.",
  },
  {
    id: "STU-2026-002",
    name: "Sophia Rodriguez",
    email: "sophia.r@university.edu",
    phone: "+1 (555) 345-6789",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    course: "Biomedical Engineering",
    year: "Year 2",
    status: "Active",
    enrolledDate: "2025-01-15",
    gpa: 3.94,
    dateOfBirth: "2005-07-22",
    address: "1204 Pine Hollow Road, Seattle, WA",
    guardianName: "Elena Rodriguez",
    emergencyContact: "+1 (555) 876-5432",
    bio: "Focusing on neural prosthetics, biomechanics, and clinical robotic surgery applications.",
  },
  {
    id: "STU-2026-003",
    name: "Marcus Chen",
    email: "marcus.chen@university.edu",
    phone: "+1 (555) 456-7890",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    course: "Business Administration",
    year: "Year 4",
    status: "Graduated",
    enrolledDate: "2023-09-10",
    gpa: 3.65,
    dateOfBirth: "2003-11-05",
    address: "88 Market St, San Francisco, CA",
    guardianName: "Lawrence Chen",
    emergencyContact: "+1 (555) 765-4321",
    bio: "Specializing in venture capital valuation, international trade, and product strategy.",
  },
  {
    id: "STU-2026-004",
    name: "Amara Okafor",
    email: "amara.o@university.edu",
    phone: "+1 (555) 567-8901",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    course: "Data Science & AI",
    year: "Year 1",
    status: "Pending",
    enrolledDate: "2026-02-01",
    gpa: 3.72,
    dateOfBirth: "2006-01-30",
    address: "415 Lexington Ave, New York, NY",
    guardianName: "Chidi Okafor",
    emergencyContact: "+1 (555) 654-3210",
    bio: "Exploring foundation models, reinforcement learning, and automated mathematical proofs.",
  },
  {
    id: "STU-2026-005",
    name: "Liam O'Connor",
    email: "liam.oc@university.edu",
    phone: "+1 (555) 678-9012",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    course: "Cyber Security",
    year: "Year 3",
    status: "Active",
    enrolledDate: "2024-09-01",
    gpa: 3.45,
    dateOfBirth: "2004-09-18",
    address: "312 Beacon Hill Blvd, Boston, MA",
    guardianName: "Fiona O'Connor",
    emergencyContact: "+1 (555) 543-2109",
    bio: "Interested in cryptanalysis, zero-day threat prevention, and cloud perimeter defense.",
  },
  {
    id: "STU-2026-006",
    name: "Elena Rostova",
    email: "elena.r@university.edu",
    phone: "+1 (555) 789-0123",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    course: "Architecture & Design",
    year: "Year 2",
    status: "Suspended",
    enrolledDate: "2025-02-10",
    gpa: 2.89,
    dateOfBirth: "2005-04-12",
    address: "550 Lake Shore Dr, Chicago, IL",
    guardianName: "Viktor Rostov",
    emergencyContact: "+1 (555) 432-1098",
    bio: "Focusing on sustainable urban architecture and zero-net-carbon structural planning.",
  },
  {
    id: "STU-2026-007",
    name: "Devon Vance",
    email: "devon.v@university.edu",
    phone: "+1 (555) 890-1234",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    course: "Electrical Engineering",
    year: "Year 1",
    status: "Active",
    enrolledDate: "2026-01-20",
    gpa: 3.55,
    dateOfBirth: "2006-08-09",
    address: "902 Colorado St, Austin, TX",
    guardianName: "Sarah Vance",
    emergencyContact: "+1 (555) 321-0987",
    bio: "Passionate about semiconductor design, microcontrollers, and renewable energy conversion grids.",
  },
  {
    id: "STU-2026-008",
    name: "Chloe Dupont",
    email: "chloe.d@university.edu",
    phone: "+1 (555) 901-2345",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
    course: "International Relations",
    year: "Year 4",
    status: "Active",
    enrolledDate: "2023-09-12",
    gpa: 3.82,
    dateOfBirth: "2003-12-03",
    address: "1801 Pennsylvania Ave, Washington, DC",
    guardianName: "Henri Dupont",
    emergencyContact: "+1 (555) 210-9876",
    bio: "Concentrating on international diplomacy, humanitarian treaty frameworks, and conflict mediation.",
  },
];

export const COURSES_LIST = [
  "Computer Science",
  "Biomedical Engineering",
  "Business Administration",
  "Data Science & AI",
  "Cyber Security",
  "Architecture & Design",
  "Electrical Engineering",
  "International Relations",
  "Mechanical Engineering",
  "Civil Engineering",
];

export const ACADEMIC_YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Postgraduate"];
export const STATUS_LIST: Array<Student["status"]> = ["Active", "Pending", "Suspended", "Graduated"];
