document.addEventListener('DOMContentLoaded', function() {
    // Load the initial README.md file
    fetch('README.md')
        .then(response => response.text())
        .then(data => {
            document.querySelector('.content').innerHTML = marked.parse(data);
        })
        .catch(error => {
            console.error('Error loading README.md:', error);
            document.querySelector('.content').innerHTML = '<p>Failed to load README.md</p>';
        });

    // Handle course selection
    const courseLinks = document.querySelectorAll('.course-link');
    courseLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const courseName = this.getAttribute('data-course');
            loadCourse(courseName);
        });
    });

    // Load course content
    function loadCourse(courseName) {
        // Update sidebar links
        document.querySelector('.sidebar h3').textContent = courseName;
        document.querySelectorAll('.course-link').forEach(link => {
            link.style.display = 'none';
        });
        
        // Add back button
        const backButton = document.createElement('a');
        backButton.href = '#';
        backButton.className = 'course-link';
        backButton.textContent = 'Back to Main';
        backButton.style.display = 'block';
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            location.reload();
        });
        document.querySelector('.sidebar').prepend(backButton);
        
        // Load course index.md
        fetch(`${courseName}/index.md`)
            .then(response => response.text())
            .then(data => {
                document.querySelector('.content').innerHTML = marked.parse(data);
                
                // Make chapter links clickable
                const chapterLinks = document.querySelectorAll('.content a');
                chapterLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        e.preventDefault();
                        const chapterPath = this.getAttribute('href');
                        fetch(`${courseName}/${chapterPath}`)
                            .then(res => res.text())
                            .then(chapterData => {
                                document.querySelector('.content').innerHTML = marked.parse(chapterData);
                            })
                            .catch(error => {
                                console.error('Error loading chapter file:', error);
                                document.querySelector('.content').innerHTML = `<p>Failed to load chapter file</p>`;
                            });
                    });
                });
            })
            .catch(error => {
                console.error(`Error loading ${courseName}/index.md:`, error);
                document.querySelector('.content').innerHTML = `<p>Failed to load ${courseName}/index.md</p>`;
            });
    }
});
