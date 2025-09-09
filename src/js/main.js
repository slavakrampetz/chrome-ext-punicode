;(function(root) {

	var	w = root,
			d = document;

	var $getFirst = function(selector) {
		var list = d.querySelectorAll(selector);
		if (list.length !== 1) {
			return false;
		}
		return list[0];
	};

	var $getAll = function(selector) {
		var list = d.querySelectorAll(selector);
		if (list.length === 0) {
			return false;
		}
		return list;
	};

	var	$src  = $getFirst('.js-source'),
			$tgt = $getFirst('.js-encoded')
			$copy = $getFirst('.js-copy'),
			current = '',
			tmId = null;

	if (!$src || !$tgt || !$copy) {
		console.error('Cannot find main elements by selectors: .js-source, .js-encoded, .js-copy');
		return;
	}

	var do_convert = function() {
		tmId = null;
		var val = $src.value.trim();
		if (val === current) { // nothing changed
			return;
		}

		if (val === '') {
			$tgt.value = '';
			current = val;
			$copy.classList.add('is-disabled');
			return;
		}
		$copy.classList.remove('is-disabled');

		try {
			var encoded = punycode.toASCII(val);
			var decoded = punycode.toUnicode(val);
		} catch (err) {
			console.error(err);
			$tgt.value = '';
			$src.classList.add('is-error');
			current = val;
			return;
		}

		if (encoded !== val) {
			$tgt.value = encoded;
		} else {
			$tgt.value = decoded;
		}
		$src.classList.remove('is-error');
		current = val;
	};

	var on_change = function() {
		var val = $src.value;
		if (val === current) { // nothing changed
			return;
		}
		if (tmId !== null) {
			clearTimeout(tmId);
		}
		tmId = setTimeout(do_convert, 250);
	};

	// Listen on changes
	$src.addEventListener('keyup', on_change)

	if (!chrome || !chrome.i18n) {
		chrome = {
			i18n: {
				getMessage: function(key) {
					return 'LD: ' + key;
				}
			}
		}
	}

	var ld = chrome.i18n.getMessage("srcPlaceHolder");
	$src.setAttribute('placeholder', ld);
	$src.setAttribute('title', ld);
	ld = chrome.i18n.getMessage("tgtPlaceHolder");
	$tgt.setAttribute('placeholder', ld);
	$tgt.setAttribute('title', ld);
	ld = chrome.i18n.getMessage("copyTitle");
	$copy.setAttribute('title', ld);

	// Attach clipboard copy
	var clip = new Clipboard('.js-copy');
	clip.on('success', function(e) {
		e.clearSelection();
		$src.focus();
	});

}(this));
