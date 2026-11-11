//category filtering
document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.querySelector('[data-project-gallery]');

    if (!gallery) return;

    const buttons = gallery.querySelectorAll('[data-filter]');
    const projects = gallery.querySelectorAll('[data-category]');

    buttons.forEach(button => {
        button.addEventListener('click', () => {

            const category = button.dataset.filter;

            projects.forEach(project => {
                const show = category === 'all' ||
                    project.dataset.category === category;

                project.classList.toggle('hidden', !show);
            });

        });
    });

});

//Content loading for mywork.html

document.addEventListener('DOMContentLoaded', () => {

    const page = document.querySelector('[data-project-detail]');
    if (!page) return;

    // Information about each project
    const projects = [
        {
            id: 'getmymeal',
            title: 'GetMyMeal',
            category: 'Software',
            image: 'GetMyMealLight.png',
            summary: 'A recipe application developed with MAUI during my studies at TAFE.',
            overview: 'GetMyMeal helps users discover recipes and plan meals.',
            tools: ['C#', '.NET MAUI', 'API'],
            highlights: ['Recipe search', 'Favourites', 'Grocery list']
        },
        {
            id: 'parametric-furniture',
            title: 'Parametric Furniture',
            category: '3D Modelling',
            image: 'sienna-isometric.png',
            summary: 'A parametric furniture design project.',
            overview: 'Parametric furniture models created with Fusion 360.',
            tools: ['Fusion 360', '3D Modelling'],
            highlights: ['3D design', 'Dimensions', 'Parametric modelling']
        },
        {
            id: 'esp32-door-sensor',
            title: 'ESP32 Project',
            category: 'Electronics',
            image: 'mandy_exploded.PNG',
            summary: 'An IoT project using ESP32 and sensors.',
            overview: 'Learning how to connect devices and sensors.',
            tools: ['ESP32', 'IoT', 'Sensors'],
            highlights: ['Sensors', 'Connectivity', 'Prototyping']
        },
        {
            id: 'hardware-hackathon',
            title: 'Hardware Hackathon',
            category: 'Hackathon',
            image: 'mandy_front.png',
            summary: 'Hardware Hackathon Project in Curtin University.',
            overview: 'Designing and developing a hardware prototype to assist people in need.',
            tools: ['ESP32', 'Sensors', '3D Modelling', 'IoT', '3D Printing'],
            highlights: ['Planning', 'Design', 'Testing']
        },
        {
            id: 'portfolio-website',
            title: 'Portfolio Website',
            category: 'Software',
            image: 'portfolio-AT2.png',
            summary: 'A responsive personal portfolio website done during the first term of Web Technologies.',
            overview: 'First website using HTML, CSS, TailwindCSS and JavaScript.',
            tools: ['HTML', 'Tailwind CSS', 'JavaScript'],
            highlights: ['Responsive layout', 'Navigation', 'Web design']
        }
    ];

    // Identify the selected project from the URL
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');

    const index = projects.findIndex(project => project.id === projectId);
    const selectedIndex = index === -1 ? 0 : index;
    const project = projects[selectedIndex];

    // Update the page information
    page.querySelector('[data-detail-title]').textContent = project.title;
    page.querySelector('[data-detail-category]').textContent = project.category;
    page.querySelector('[data-detail-summary]').textContent = project.summary;
    page.querySelector('[data-detail-overview]').textContent = project.overview;
    page.querySelector('[data-detail-caption]').textContent = project.title;

    const image = page.querySelector('[data-detail-image]');
    image.src = `Assets/img/${project.image}`;
    image.alt = project.title;

    document.title = `${project.title} | Antonio Muscerino`;

    // Display project technologies and highlights
    const toolsList = page.querySelector('[data-detail-tools]');
    const highlightsList = page.querySelector('[data-detail-highlights]');

    toolsList.innerHTML = '';
    highlightsList.innerHTML = '';

    project.tools.forEach(tool => {
        const item = document.createElement('li');
        item.textContent = tool;
        item.className = 'rounded-full border border-[#99CFFF]/50 px-3 py-2 text-sm';
        toolsList.appendChild(item);
    });

    project.highlights.forEach(highlight => {
        const item = document.createElement('li');
        item.textContent = highlight;
        highlightsList.appendChild(item);
    });

    // Previous and next project navigation
    const previous = projects[
        (selectedIndex - 1 + projects.length) % projects.length
    ];

    const next = projects[
        (selectedIndex + 1) % projects.length
    ];

    const previousLink = page.querySelector('[data-detail-previous]');
    const nextLink = page.querySelector('[data-detail-next]');

    previousLink.href = `mywork.html?project=${previous.id}`;
    previousLink.textContent = `← ${previous.title}`;

    nextLink.href = `mywork.html?project=${next.id}`;
    nextLink.textContent = `${next.title} →`;

});
