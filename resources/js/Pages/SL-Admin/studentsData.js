const firstNames = [
    'Adrian', 'Alyssa', 'Bea', 'Carlo', 'Chloe', 'Daniel', 'Ella',
    'Francis', 'Gabriel', 'Hannah', 'Ivan', 'Jasmine', 'Kevin', 'Lara',
    'Marco', 'Nicole', 'Paolo', 'Rhea', 'Sean', 'Trisha', 'Vincent',
];

const lastNames = [
    'Aguilar', 'Bautista', 'Castillo', 'Dela Cruz', 'Evangelista',
    'Flores', 'Garcia', 'Hernandez', 'Ignacio', 'Jimenez', 'Lim',
    'Mendoza', 'Navarro', 'Ocampo', 'Pascual', 'Reyes', 'Santos',
    'Torres', 'Valdez', 'Villanueva', 'Yap',
];

const campuses = [
    'Ateneo de Manila University',
    'Cebu Institute of Technology',
    'De La Salle University',
    'Far Eastern University',
    'Mapua University',
    'National University',
    'Silliman University',
    'University of San Carlos',
    'University of Santo Tomas',
    'West Visayas State University',
];

const yearLevels = [
    'Freshman (1st Year)',
    'Sophomore (2nd Year)',
    'Junior (3rd Year)',
    'Senior (4th Year)',
];

const getStatus = (index) => {
    const position = index % 10;

    if (position <= 4) return 'Verified';
    if (position <= 7) return 'Renew';
    return 'Blocked';
};

export const students = Array.from({ length: 100 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[(index * 5 + 3) % lastNames.length];
    const accountNumber = String(index + 1).padStart(4, '0');

    return {
        id: index + 1,
        account: `MSL-${accountNumber}`,
        name: `${firstName} ${lastName}`,
        ign: firstName.toUpperCase().slice(0, 8),
        uid: String(71244743 + index),
        server: String(1234 + (index % 20)),
        gender: index % 2 === 0 ? 'male' : 'female',
        campus: campuses[(index * 4 + 2) % campuses.length],
        yearLevel: yearLevels[index % yearLevels.length],
        status: getStatus(index),
        isNew: index % 5 === 0,
    };
});
