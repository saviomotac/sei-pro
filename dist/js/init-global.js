/******************************************************************************
 * SEI Pro - Override Global
 * Adiciona overrides globais para o comportamento da extensão
*******************************************************************************/

(function() {
    var _extOriginRe = /^(chrome|moz)-extension:\/\//;

    // Registra um ajaxPrefilter na instância jQuery para controlar cache de scripts.
    // O marcador _seiProPrefilterApplied evita aplicar duas vezes na mesma instância.
    function _seiProApplyPrefilter(jq) {
        if (!jq || typeof jq.ajaxPrefilter !== 'function' || jq._seiProPrefilterApplied) return;
        jq._seiProPrefilterApplied = true;
        jq.ajaxPrefilter('script', function(s) {
            // Para scripts da extensão, força cache=true para evitar o parâmetro ?_=timestamp.
            if (s.url && _extOriginRe.test(s.url)) {
                s.cache = true;
            }
        });
    }

    // Aplica na instância jQuery carregada como content script
    _seiProApplyPrefilter($);

    // Intercepta quando o jQuery é substituído (ex: init.js carrega jquery-3.4.1 via $.getScript)
    var _jq = window.jQuery;
    Object.defineProperty(window, 'jQuery', {
        configurable: true,
        enumerable: true,
        get: function() { return _jq; },
        set: function(val) {
            _jq = val;
            _seiProApplyPrefilter(val);
        }
    });
})();
