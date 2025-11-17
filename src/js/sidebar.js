// sidebar.js - Sistema de sidebar responsive mejorado

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const sidebarTitle = sidebar.querySelector('.sidebar-title');
    const topicList = sidebar.querySelector('.topic-list');
    
    // Agregar icono de chevron si no existe
    if (!sidebarTitle.querySelector('.fa-chevron-down')) {
        const chevron = document.createElement('i');
        chevron.className = 'fas fa-chevron-down';
        sidebarTitle.appendChild(chevron);
    }

    /**
     * Inicializa el estado de la sidebar según el tamaño de pantalla
     */
    function initializeSidebar() {
        if (window.innerWidth <= 768) {
            // En móviles: colapsada por defecto
            sidebar.classList.remove('open');
            topicList.style.display = 'none';
            sidebarTitle.style.cursor = 'pointer';
        } else {
            // En desktop/tablet: siempre expandida
            sidebar.classList.add('open');
            topicList.style.display = 'grid';
            sidebarTitle.style.cursor = 'default';
        }
    }

    /**
     * Toggle de la sidebar (solo en móviles)
     */
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('open');
            
            if (sidebar.classList.contains('open')) {
                topicList.style.display = 'grid';
            } else {
                topicList.style.display = 'none';
            }
        }
    }

    /**
     * Cierra la sidebar automáticamente al seleccionar un tema (solo móviles)
     */
    function setupTopicItemListeners() {
        const topicItems = document.querySelectorAll('.topic-item');
        
        topicItems.forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    // Pequeño delay para que el usuario vea el cambio de tema activo
                    setTimeout(() => {
                        sidebar.classList.remove('open');
                        topicList.style.display = 'none';
                    }, 300);
                }
            });
        });
    }

    // Event listener para el click en el título
    sidebarTitle.addEventListener('click', toggleSidebar);

    // Inicializar estado al cargar
    initializeSidebar();

    // Configurar listeners de los items
    setupTopicItemListeners();

    // Reinicializar al cambiar el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            initializeSidebar();
        }, 250);
    });
});