const PLANT_IMAGE =
    "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1600&q=80";

const PORTRAIT_IMAGE =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80";

// Sample content for the Home page.
// Replace sample events, testimonials, statistics, and FAQ answers
// with approved content before publishing.
export const homeData = {
    announcement: {
        title: "The NU Era:",
        description: "National University Bulldogs Reign Supreme",
        linkLabel: "See More",
        href: "/News",
    },

    hero: {
        heading: [
            { text: "Empowering" },
            { text: "Student-Gamers", accent: true },
            { text: "to Become the Next" },
            { text: "Generation Leaders" },
        ],
        description:
            "We equip student-gamers and esports organizations with recognition, resources, and professional mentorship — everything you need to build a thriving campus community.",
        actions: [
            {
                label: "Be A Member",
                href: "/register",
                variant: "primary",
            },
            {
                label: "Partner With Us",
                href: "/Partnerships",
                variant: "secondary",
            },
        ],
        slides: [
            {
                id: "collegiate-clash",
                badge: "LIVE NOW",
                title: "MCC Season 4: Collegiate Clash",
                description:
                    "The biggest inter-school MLBB tournament is back. Watch the regionals live.",
                date: "Nov 27, 2025",
                image: PLANT_IMAGE,
                href: "/Event",
            },
            {
                id: "campus-scrims",
                badge: "FEATURED",
                title: "Campus Scrims: Open Qualifiers",
                description:
                    "Weekly scrims for student teams. Build synergy, earn rankings, get noticed.",
                date: "Dec 04, 2025",
                image: PLANT_IMAGE,
                href: "/Event",
            },
            {
                id: "partner-spotlight",
                badge: "UP NEXT",
                title: "MSL Partner Spotlight",
                description:
                    "Meet our campus partners and explore resources for esports org leaders.",
                date: "Dec 18, 2025",
                image: PLANT_IMAGE,
                href: "/Partnerships",
            },
        ],
    },

    about: {
        title: "About MSL Philippines",
        description:
            "We are the official student leader body of Mobile Legends: Bang Bang in the Philippines. Guided by Moonton, we create inclusive campus initiatives that unite players, boost school pride, and prove that gaming passion goes hand-in-hand with academic success.",
        linkLabel: "Learn More About Us",
        href: "/About",
        statistics: [
            {
                icon: "user",
                value: "22K+",
                label: "STUDENT GAMERS",
            },
            {
                icon: "building",
                value: "150+",
                label: "CAMPUS COMMUNITIES",
            },
            {
                icon: "trophy",
                value: "110+",
                label: "EVENTS SPONSORED",
            },
            {
                icon: "users",
                value: "240+",
                label: "STUDENT LEADERS",
            },
        ],
    },

    network: {
        title: "MSL Network Organizations",
        logos: [
            {
                src: "/Images/Home/Logo%201.png",
                alt: "MSL network organization 1",
            },
            {
                src: "/Images/Home/Logo%202.png",
                alt: "MSL network organization 2",
            },
            {
                src: "/Images/Home/Logo%203.png",
                alt: "MSL network organization 3",
            },
            {
                src: "/Images/Home/Logo%204.png",
                alt: "MSL network organization 4",
            },
            {
                src: "/Images/Home/Logo%205.png",
                alt: "MSL network organization 5",
            },
        ],
    },

    programs: {
        title: "Our Programs",
        description:
            "Building opportunities for student leaders through events, training, and nationwide esports initiatives.",
        linkLabel: "View All Programs",
        href: "/Programs",
        items: [
            {
                id: "campus-tournament",
                title: "Campus Tournament",
                description:
                    "Gain official tournaments, grants, and mentorship for your campus community.",
                image: PLANT_IMAGE,
                href: "/CampusTournament",
            },
            {
                id: "event-sponsorships",
                title: "Event Sponsorships",
                description:
                    "Partner-backed events and resources that elevate your student programs.",
                image: PLANT_IMAGE,
                href: "/Buffs&Support",
            },
            {
                id: "leadership-labs",
                title: "Leadership Labs",
                description:
                    "Workshops and training that sharpen skills for the next generation of leaders.",
                image: PLANT_IMAGE,
                href: "/Programs",
            },
            {
                id: "mlbb-campaigns",
                title: "MLBB Campaigns",
                description:
                    "Creative activations and nationwide drives that celebrate the spirit of Mobile Legends.",
                image: PLANT_IMAGE,
                href: "/Programs",
            },
            {
                id: "community-grants",
                title: "Community Grants",
                description:
                    "Funding and support to help verified campus communities grow sustainably.",
                image: PLANT_IMAGE,
                href: "/Buffs&Support",
            },
        ],
    },

    community: {
        title: "Community Voices",
        description:
            "Hear from the student leaders, campus organizers, and partners who are driving the MSL Philippines movement forward.",
        voices: [
            {
                id: "voice-1",
                name: "Leslie Alexander",
                role: "Student Leader",
                university: "University of Santo Tomas",
                quote: "MSL gave our community a platform to grow as leaders and inspire student-gamers nationwide.",
                image: PORTRAIT_IMAGE,
            },
            {
                id: "voice-2",
                name: "Leslie Alexander",
                role: "Student Leader",
                university: "University of Santo Tomas",
                quote: "Through MSL programs, we built stronger campus initiatives and connected with teams across regions.",
                image: PORTRAIT_IMAGE,
            },
            {
                id: "voice-3",
                name: "Leslie Alexander",
                role: "Student Leader",
                university: "University of Santo Tomas",
                quote: "The mentorship and opportunities helped us turn our passion into meaningful school impact.",
                image: PORTRAIT_IMAGE,
            },
            {
                id: "voice-4",
                name: "Leslie Alexander",
                role: "Student Leader",
                university: "University of Santo Tomas",
                quote: "MSL is where students, organizers, and partners come together to build lasting communities.",
                image: PORTRAIT_IMAGE,
            },
            {
                id: "voice-5",
                name: "Jacob Jones",
                role: "Campus Organizer",
                university: "Ateneo de Manila University",
                quote: "Our campus programs became more structured because we learned directly from the MSL network.",
                image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
            },
            {
                id: "voice-6",
                name: "Kristin Watson",
                role: "Student Leader",
                university: "De La Salle University",
                quote: "The mentorship gave us confidence to lead bigger events and support more student-gamers.",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=80",
            },
            {
                id: "voice-7",
                name: "Wade Warren",
                role: "Partner Representative",
                university: "Far Eastern University",
                quote: "MSL bridges campuses and partners in a way that creates real opportunities for students.",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
            },
            {
                id: "voice-8",
                name: "Jenny Wilson",
                role: "Community Lead",
                university: "Mapua University",
                quote: "We were able to launch initiatives that improved participation and built healthier team culture.",
                image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
            },
        ],
    },

    paths: {
        title: "Choose Your Path",
        description:
            "Select how you want to get involved with MSL Philippines.",
        items: [
            {
                id: "students",
                theme: "student",
                icon: "graduation",
                title: "For Students",
                description:
                    "Establish an MSL community in your school. Gain access to official tournaments, leadership grants, and mentorship programs.",
                buttonLabel: "Be A Member",
                href: "/register",
            },
            {
                id: "partners",
                theme: "partner",
                icon: "building",
                title: "For Partners",
                description:
                    "Empower the next generation. Collaborate with us for campus activations, brand integration, and student-led events.",
                buttonLabel: "Partner With Us",
                href: "/Partnerships",
            },
        ],
    },

    faq: {
        title: "Frequently Asked Questions",
        description:
            "Everything you need to know about joining and partnering with us.",
        items: [
            {
                question: "Who can join MSL?",
                answer: "Any student, campus esports organization, or recognized school-based group with a passion for Mobile Legends and esports development can be part of MSL.",
            },
            {
                question: "How can I join if I'm just an individual student?",
                answer: "More information will be added soon.",
            },
            {
                question: "How do we start an MSL Community in our school?",
                answer: "More information will be added soon.",
            },
            {
                question: "What benefits do MSL Communities receive?",
                answer: "More information will be added soon.",
            },
            {
                question: "How does MSL support esports tournaments?",
                answer: "More information will be added soon.",
            },
            {
                question: "Can brands and partners collaborate with MSL?",
                answer: "More information will be added soon.",
            },
            {
                question:
                    "What benefits do partners gain when collaborating with MSL?",
                answer: "More information will be added soon.",
            },
            {
                question:
                    "Do MSL members receive training or development opportunities?",
                answer: "More information will be added soon.",
            },
            {
                question: "Is MSL exclusive to Mobile Legends?",
                answer: "More information will be added soon.",
            },
            {
                question: "How can we contact MSL Philippines?",
                answer: "More information will be added soon.",
            },
        ],
    },
};
