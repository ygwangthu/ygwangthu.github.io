(function($) {

    var $window = $(window),
        $body = $('body'),
        $wrapper = $('#wrapper'),
        $main = $('#main'),
        $nav = $('#nav'), $nav_links = $nav.children('a');

    // 初始动画
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // -------------------------------
    // 显示面板函数
    // -------------------------------
    function showPanel(panelId) {
        var $panel = $main.children(panelId);

        if ($panel.length > 0) {
            // 面板已在 DOM 中，直接切换
            $main.children('.panel').addClass('inactive').hide();
            $nav_links.removeClass('active');
            $panel.show().removeClass('inactive');
            $nav_links.filter('[href="' + panelId + '"]').addClass('active');

            $main.css({
                'max-height': $panel.outerHeight() + 'px',
                'min-height': $panel.outerHeight() + 'px'
            });

            setTimeout(function() {
                $main.css({ 'max-height': '', 'min-height': '' });
                $window.triggerHandler('--refresh');
            }, 250);

        } else {
            // 面板不在 DOM 中，尝试动态加载
            loadModule(panelId.slice(1), panelId);
        }
    }

    // -------------------------------
    // 动态加载模块函数
    // -------------------------------
    function loadModule(moduleId, panelId) {
    fetch(`modules/${moduleId}.html`)
        .then(res => {
            if (!res.ok) throw new Error('Module not found');
            return res.text();
        })
        .then(html => {
            // 移除原有 panel
            $main.children('.panel').addClass('inactive').hide();

            // 直接插入 HTML 内容，不再包一层新的 panel
            $main.append(html);

            // 调用 showPanel 切换
            showPanel(panelId);

            // 初始化懒加载
            if ($.fn.Lazy) $('.lazy').Lazy({ effect: "fadeIn" });
        })
        .catch(err => {
            console.warn(err.message);
        });
	}

    // -------------------------------
    // 导航点击事件
    // -------------------------------
    $nav_links.on('click', function(event) {
        event.preventDefault();
        var href = $(this).attr('href');

        if (window.location.hash !== href) {
            window.location.hash = href; // 保持导航高亮
        } else {
            showPanel(href);
        }

        // 阻止页面滚动
        setTimeout(function() { window.scrollTo(0, 0); }, 1);
    });

    // -------------------------------
    // 页面首次加载或 hashchange
    // -------------------------------
    function initPage() {
        var initialHash = window.location.hash || '#me';
        showPanel(initialHash);

        // 阻止浏览器滚动
        setTimeout(function() { window.scrollTo(0, 0); }, 1);
    }

    $window.on('hashchange', initPage);
    $(document).ready(initPage);

})(jQuery);
