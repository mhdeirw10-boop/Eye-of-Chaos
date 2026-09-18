// Chaos UI Controller - التحكم بالقائمة الجانبية والواجهة
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menu');
    const openSidebarBtn = document.getElementById('openSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');

    function openMenu(e) {
        if (e) e.stopPropagation();
        if (sidebar) {
            sidebar.classList.add('active');
        }
    }

    function closeMenu(e) {
        if (e) e.stopPropagation();
        if (sidebar) {
            sidebar.classList.remove('active');
        }
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (sidebar) {
                sidebar.classList.toggle('active');
            }
        });
    }

    if (openSidebarBtn) {
        openSidebarBtn.addEventListener('click', openMenu);
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeMenu);
    }
});
