'use strict';

/* ==========================================================================
   Лабораторна робота №3. Варіант 4.
   Завдання 1: записи курсів (тип даних «масив», методи масивів, функції)
   ========================================================================== */

// ---------- 1. Початкові дані: 10 записів курсів ----------
// Тривалість вивчення зберігається як { hours, minutes }.
const courses = [
    { id: 1,  title: 'Пригоди Веселого Рахівничка', author: 'Коваленко О.',  teachers: ['Іваненко Н.', 'Мельник Т.'],  taskType: 'Міні-ігри',        views1: 120, views2: 135, duration: { hours: 12, minutes: 30 } },
    { id: 2,  title: 'Юний кодер у світі Scratch',  author: 'Шевченко Д.',   teachers: ['Бойко А.'],                    taskType: 'Пазли з блоків',   views1: 95,  views2: 110, duration: { hours: 18, minutes: 0 } },
    { id: 3,  title: 'English ABC',                 author: 'Бондаренко І.', teachers: ['Smith J.', 'Гриценко В.'],     taskType: 'Flashcards',       views1: 150, views2: 160, duration: { hours: 10, minutes: 15 } },
    { id: 4,  title: 'Маленький натураліст',        author: 'Ткаченко В.',   teachers: ['Левчук С.'],                   taskType: 'Фото-квести',      views1: 80,  views2: 70,  duration: { hours: 12, minutes: 30 } },
    { id: 5,  title: 'Космічні мандри',             author: 'Кравчук Л.',    teachers: ['Савчук Р.', 'Дяченко К.'],     taskType: '3D-мандрівка',     views1: 60,  views2: 55,  duration: { hours: 8,  minutes: 45 } },
    { id: 6,  title: 'Веселе малювання',            author: 'Савченко М.',   teachers: ['Олійник Є.'],                  taskType: 'Творчі завдання',  views1: 70,  views2: 90,  duration: { hours: 6,  minutes: 0 } },
    { id: 7,  title: 'Музичні казки',               author: 'Олійник Р.',    teachers: ['Мазур О.'],                    taskType: 'Аудіо-вікторини',  views1: 110, views2: 105, duration: { hours: 10, minutes: 15 } },
    { id: 8,  title: 'Шахи для малят',              author: 'Поліщук А.',    teachers: ['Яковенко Д.', 'Литвин П.'],    taskType: 'Логічні задачі',   views1: 45,  views2: 40,  duration: { hours: 15, minutes: 30 } },
    { id: 9,  title: 'Перші кроки в робототехніці', author: 'Лисенко Н.',    teachers: ['Мороз Г.'],                    taskType: 'Збирання моделей', views1: 130, views2: 150, duration: { hours: 18, minutes: 0 } },
    { id: 10, title: 'Вчимося читати',              author: 'Гордієнко С.',  teachers: ['Руденко Л.', 'Паламарчук Ю.'], taskType: 'Інтерактивні вправи', views1: 100, views2: 95, duration: { hours: 6, minutes: 0 } }
];

// ---------- 2. Допоміжні функції ----------

// Тривалість у хвилинах (для порівняння та сортування)
function durationToMinutes(duration) {
    return duration.hours * 60 + duration.minutes;
}

// Хвилини -> рядок «12 год 30 хв»
function formatMinutes(totalMinutes) {
    const rounded = Math.round(totalMinutes);
    return `${Math.floor(rounded / 60)} год ${rounded % 60} хв`;
}

// Кількість користувачів, що цікавляться курсом: середнє за добу_1 і добу_2
function averageInterest(course) {
    return (course.views1 + course.views2) / 2;
}

// Підготовка масиву для виводу через console.table
function toRows(list) {
    return list.map(course => ({
        'ID': course.id ?? '—',
        'Назва': course.title ?? '—',
        'Автор': course.author ?? '—',
        'Викладачі': course.teachers?.join(', ') ?? '—',
        'Тип завдань': course.taskType ?? '—',
        'Доба_1': course.views1 ?? '—',
        'Доба_2': course.views2 ?? '—',
        'Тривалість': course.duration ? formatMinutes(durationToMinutes(course.duration)) : '—'
    }));
}

// ---------- 3. Пункт а) впорядкування за тривалістю + середня кількість користувачів ----------
function sortByDuration(list) {
    // [...list] — копія, щоб не змінювати вихідний масив
    return [...list].sort((a, b) => durationToMinutes(a.duration) - durationToMinutes(b.duration));
}

// Середня кількість користувачів для курсів з однаковою тривалістю
function averageInterestByDuration(list) {
    const groups = list.reduce((acc, course) => {
        const key = durationToMinutes(course.duration);
        if (!acc[key]) acc[key] = [];
        acc[key].push(course);
        return acc;
    }, {});

    return Object.keys(groups).map(Number).sort((a, b) => a - b).map(minutes => {
        const group = groups[minutes];
        const sum = group.reduce((total, course) => total + averageInterest(course), 0);
        return {
            'Тривалість': formatMinutes(minutes),
            'Курсів': group.length,
            'Середня кількість користувачів': sum / group.length
        };
    });
}

// ---------- 4. Пункт б) курс з мінімумом читачів за добу_2 ----------
function findMinViewsDay2(list) {
    const minValue = Math.min(...list.map(course => course.views2));
    return list.filter(course => course.views2 === minValue); // якщо мінімум повторюється — повертаємо всі
}

// ---------- 5. Пункт в) додавання нового курсу ----------
function isFilled(value) {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return !Number.isNaN(value);
    if (Array.isArray(value)) return value.length > 0;
    return true;
}

function isCourseComplete(course) {
    return isFilled(course.id) && isFilled(course.title) && isFilled(course.author)
        && isFilled(course.teachers) && isFilled(course.taskType)
        && isFilled(course.views1) && isFilled(course.views2)
        && isFilled(course.duration) && isFilled(course.duration.hours) && isFilled(course.duration.minutes);
}

function addCourse(list, newCourse) {
    // Є порожні поля -> на початок списку
    if (!isCourseComplete(newCourse)) {
        return [newCourse, ...list];
    }
    // Всі поля є -> шукаємо місце у списку, впорядкованому за автором
    const sorted = [...list].sort((a, b) => (a.author ?? '').localeCompare(b.author ?? '', 'uk'));
    let index = sorted.findIndex(course => (course.author ?? '').localeCompare(newCourse.author, 'uk') > 0);
    if (index === -1) index = sorted.length;
    sorted.splice(index, 0, newCourse);
    return sorted;
}

// ---------- 6. Пункт г) одночасне вивчення декількох курсів ----------
// До 3 курсів включно — тривалість не змінюється, інакше кожна збільшується в 1,5 рази
function calcSimultaneousDuration(list, ids) {
    const selected = list.filter(course => ids.includes(course.id));
    const coefficient = selected.length <= 3 ? 1 : 1.5;

    const result = selected.map(course => {
        const original = durationToMinutes(course.duration);
        return {
            'ID': course.id,
            'Назва': course.title,
            'Початкова тривалість': formatMinutes(original),
            'Нова тривалість': formatMinutes(original * coefficient)
        };
    });
    return { coefficient, count: selected.length, result };
}

// ---------- 7. Запуск і тестування ----------
function runTask1() {
    console.log('=== ЗАВДАННЯ 1. КУРСИ ===');

    console.log('\n--- Початковий список (10 записів) ---');
    console.table(toRows(courses));

    // а)
    console.log('\n--- а) Курси, впорядковані за тривалістю вивчення ---');
    console.table(toRows(sortByDuration(courses)));

    console.log('--- а) Середня кількість зацікавлених користувачів (за групами з однаковою тривалістю) ---');
    console.table(averageInterestByDuration(courses));

    const overall = courses.reduce((sum, course) => sum + averageInterest(course), 0) / courses.length;
    console.log(`Середня кількість зацікавлених користувачів по всіх курсах: ${overall.toFixed(2)}`);

    // б)
    const minCourses = findMinViewsDay2(courses);
    console.log('\n--- б) Курс з мінімальною кількістю читачів за добу_2 ---');
    minCourses.forEach(course =>
        console.log(`id = ${course.id}, «${course.title}», читачів за добу_2: ${course.views2}`));

    // в)
    const incompleteCourse = { id: 11, title: 'Англійські казки', author: '', teachers: ['Коваль М.'],
        taskType: 'Аудіо', views1: 50, views2: 60, duration: { hours: 7, minutes: 20 } };
    const completeCourse = { id: 12, title: 'Математичні ігри', author: 'Мельник Т.', teachers: ['Бондар К.'],
        taskType: 'Головоломки', views1: 75, views2: 80, duration: { hours: 9, minutes: 0 } };

    console.log('\n--- в) Додавання курсу з відсутньою інформацією (автор не вказаний) -> на початок списку ---');
    console.table(toRows(addCourse(courses, incompleteCourse)));

    console.log('--- в) Додавання повного запису -> місце за автором (список впорядкований за автором) ---');
    const withNew = addCourse(courses, completeCourse);
    console.table(toRows(withNew));
    console.log(`Новий курс стоїть на позиції ${withNew.findIndex(c => c.id === completeCourse.id) + 1} з ${withNew.length}`);

    // г)
    console.log('\n--- г) Одночасне вивчення 3 курсів (id 1, 3, 5): тривалість не змінюється ---');
    const few = calcSimultaneousDuration(courses, [1, 3, 5]);
    console.log(`Курсів: ${few.count}, коефіцієнт: ${few.coefficient}`);
    console.table(few.result);

    console.log('--- г) Одночасне вивчення 5 курсів (id 1–5): тривалість кожного ×1,5 ---');
    const many = calcSimultaneousDuration(courses, [1, 2, 3, 4, 5]);
    console.log(`Курсів: ${many.count}, коефіцієнт: ${many.coefficient}`);
    console.table(many.result);
}

runTask1();