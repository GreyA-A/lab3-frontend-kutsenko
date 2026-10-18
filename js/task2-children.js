'use strict';

/* ==========================================================================
   Лабораторна робота №3. Варіант 4.
   Завдання 2: облікові записи дітей (об'єктно-орієнтований JS-код)
   ========================================================================== */

// ---------- 1. Клас «Дитина» ----------
class Child {
    constructor(lastName, firstName, age, email, purpose, requestDate, requestTime) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.age = age;
        this.email = email;
        this.purpose = purpose;           // мета зворотного зв'язку
        this.requestDate = requestDate;   // 'РРРР-ММ-ДД'
        this.requestTime = requestTime;   // 'ГГ:ХХ'
    }

    get fullName() {
        return `${this.lastName} ${this.firstName}`;
    }

    // Дата і час звернення як об'єкт Date
    getRequestDateTime() {
        return new Date(`${this.requestDate}T${this.requestTime}:00`);
    }

    getAgeClass() {
        return Child.getAgeClassName(this.age);
    }

    // Статичні методи викликаються для класу в цілому
    static timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Межі класів: ранній — до 3 включно, середній — 4, дошкільний — 5–7, шкільний — більше 7
    static getAgeClassName(age) {
        if (age <= 3) return 'ранній (до 3 років включно)';
        if (age < 5) return 'середній (від 3 до 5)';
        if (age <= 7) return 'дошкільний (5–7 років)';
        return 'шкільний (більше 7 років)';
    }
}

// ---------- 2. Клас «Реєстр дітей» ----------
class ChildRegistry {
    constructor(children = []) {
        this._children = [...children];   // «_» — внутрішня властивість (інкапсуляція)
    }

    get children() {
        return [...this._children];       // повертаємо копію, щоб не змінювали ззовні
    }

    // а) Діти, батьки яких звернулись упродовж місяця month року year
    //    не пізніше заданого моменту доби time ('ГГ:ХХ')
    filterByMonthAndTime(month, year, time) {
        const limit = Child.timeToMinutes(time);
        return this._children.filter(child => {
            const dateTime = child.getRequestDateTime();
            return dateTime.getMonth() + 1 === month
                && dateTime.getFullYear() === year
                && Child.timeToMinutes(child.requestTime) <= limit;
        });
    }

    // б) Дитина (діти) з мінімальним віком
    findYoungest() {
        const minAge = Math.min(...this._children.map(child => child.age));
        return this._children.filter(child => child.age === minAge);
    }

    // в) Поділ на вікові класи та підрахунок кількості
    classifyByAge() {
        // Початкові значення задають порядок класів і показують порожні класи
        const groups = {
            [Child.getAgeClassName(3)]: 0,
            [Child.getAgeClassName(4)]: 0,
            [Child.getAgeClassName(6)]: 0,
            [Child.getAgeClassName(8)]: 0
        };
        this._children.forEach(child => groups[child.getAgeClass()]++);
        return groups;
    }

    // г) Сортування за E-mail в алфавітному порядку
    sortByEmail() {
        return [...this._children].sort((a, b) => a.email.localeCompare(b.email));
    }
}

// ---------- 3. Дані: 10 облікових записів дітей ----------
const registry = new ChildRegistry([
    new Child('Коваленко', 'Максим', 6,  'maksym.kovalenko@gmail.com',  'співпраця',                  '2026-09-03', '09:15'),
    new Child('Шевченко',  'Софія',  4,  'sofia.shevchenko@ukr.net',    'пропозиція',                 '2026-09-12', '14:30'),
    new Child('Бондаренко','Артем',  8,  'artem.bondarenko@gmail.com',  'скарга на неякісний контент', '2026-09-18', '18:05'),
    new Child('Мельник',   'Олена',  3,  'olena.melnyk@meta.ua',        'наявність помилки',          '2026-10-02', '10:00'),
    new Child('Ткаченко',  'Данило', 5,  'danylo.tkachenko@gmail.com',  'пропозиція',                 '2026-09-25', '11:40'),
    new Child('Кравчук',   'Аліна',  7,  'alina.kravchuk@ukr.net',      'співпраця',                  '2026-10-07', '16:20'),
    new Child('Савченко',  'Іван',   10, 'ivan.savchenko@gmail.com',    'скарга на неякісний контент', '2026-10-11', '12:45'),
    new Child('Олійник',   'Марія',  4,  'maria.oliynyk@meta.ua',       'пропозиція',                 '2026-10-14', '08:30'),
    new Child('Поліщук',   'Андрій', 9,  'andrii.polishchuk@gmail.com', 'наявність помилки',          '2026-09-29', '13:10'),
    new Child('Лисенко',   'Єва',    6,  'yeva.lysenko@ukr.net',        'співпраця',                  '2026-10-16', '19:00')
]);

// ---------- 4. Допоміжний вивід ----------
function childrenToRows(list) {
    return list.map(child => ({
        'Прізвище та ім\'я': child.fullName,
        'Вік': child.age,
        'E-mail': child.email,
        'Мета звернення': child.purpose,
        'Дата': child.requestDate,
        'Час': child.requestTime
    }));
}

// ---------- 5. Запуск і тестування ----------
function runTask2() {
    console.log('\n=== ЗАВДАННЯ 2. ОБЛІКОВІ ЗАПИСИ ДІТЕЙ ===');

    console.log('\n--- Початковий список (10 записів) ---');
    console.table(childrenToRows(registry.children));

    // а)
    const month = 9, year = 2026, time = '14:00';
    console.log(`\n--- а) Діти, батьки яких звернулись у вересні ${year} не пізніше ${time} ---`);
    const found = registry.filterByMonthAndTime(month, year, time);
    if (found.length > 0) {
        console.table(childrenToRows(found));
    } else {
        console.log('За вказаними умовами звернень не знайдено.');
    }

    // б)
    console.log('\n--- б) Дитина з мінімальним віком ---');
    registry.findYoungest().forEach(child =>
        console.log(`Мінімальний вік: ${child.age}, E-mail: ${child.email}, дата звернення: ${child.requestDate}`));

    // в)
    console.log('\n--- в) Кількість дітей за віковими класами ---');
    const classes = registry.classifyByAge();
    console.table(classes);
    Object.entries(classes).forEach(([name, count]) => console.log(`${name}: ${count}`));

    // г)
    console.log('\n--- г) Сортування за E-mail в алфавітному порядку (з метою звернення) ---');
    console.table(registry.sortByEmail().map(child => ({
        'E-mail': child.email,
        'Мета звернення': child.purpose
    })));
}

runTask2();