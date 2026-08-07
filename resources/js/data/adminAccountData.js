export const SCHOOL_COLUMNS = [
    { key: 'school', label: 'School' },
    { key: 'municipality', label: 'Municipality' },
    { key: 'region', label: 'Region' },
    { key: 'schoolType', label: 'School Type' },
];

export const SCHOOLS_DATA = [
    {
        id: 1,
        school: 'Laguna University',
        municipality: 'Santa Cruz',
        region: 'Region IV-A',
        schoolType: 'State University',
        schoolCode: 'LU-001',
        logo: null,
    },
    {
        id: 2,
        school: 'Laguna University',
        municipality: 'Santa Cruz',
        region: 'Region IV-A',
        schoolType: 'State University',
        schoolCode: 'LU-002',
        logo: null,
    },
    {
        id: 3,
        school: 'Laguna University',
        municipality: 'Santa Cruz',
        region: 'Region IV-A',
        schoolType: 'State University',
        schoolCode: 'LU-003',
        logo: null,
    },
];

export const COURSE_COLUMNS = [{ key: 'course', label: 'Course' }];

export const DEPARTMENT_OPTIONS = [
    'College of Engineering',
    'College of Business',
    'College of Education',
    'College of Arts and Sciences',
];

export const COURSES_DATA = [
    {
        id: 1,
        course: 'Bachelor of Science in Information Technology',
        courseCode: 'BSIT',
        department: 'College of Engineering',
        description: '',
    },
    {
        id: 2,
        course: 'Bachelor of Science in Accountancy',
        courseCode: 'BSA',
        department: 'College of Business',
        description: '',
    },
    {
        id: 3,
        course: 'Bachelor of Secondary Education',
        courseCode: 'BSED',
        department: 'College of Education',
        description: '',
    },
];

export const STRAND_COLUMNS = [{ key: 'strand', label: 'Strand' }];

export const STRANDS_DATA = [
    {
        id: 1,
        strand: 'Science, Technology, Engineering, and Mathematics (STEM)',
        strandCode: 'STEM',
        relatedCourse: 'Bachelor of Science in Information Technology',
        briefSummary: '',
    },
    {
        id: 2,
        strand: 'Accountancy, Business, and Management (ABM)',
        strandCode: 'ABM',
        relatedCourse: 'Bachelor of Science in Accountancy',
        briefSummary: '',
    },
    {
        id: 3,
        strand: 'Humanities and Social Sciences (HUMSS)',
        strandCode: 'HUMSS',
        relatedCourse: 'Bachelor of Secondary Education',
        briefSummary: '',
    },
];

export function getCourseTrackOptions(courses = COURSES_DATA) {
    return courses.map((course) => course.course);
}
