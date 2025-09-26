$(document).ready(function () {
	const localeOptions = {
		EMEA: [
			{ value: 'en_xu', label: 'en_xu' },
			{ value: 'de_xc', label: 'de_xc' },
			{ value: 'ru_ru', label: 'ru_ru' },
			{ value: 'fr_fr', label: 'fr_fr' },
			{ value: 'pl_pl', label: 'pl_pl' },
			{ value: 'he_il', label: 'he_il' },
			{ value: 'it_it', label: 'it_it' },
			{ value: 'ar_sa', label: 'ar_sa' },
			{ value: 'uk_ua', label: 'uk_ua' },
		],
		NAMR: [
			{ value: 'en_us', label: 'en_us' },
            { value: 'en_ca', label: 'en_ca' },
            { value: 'fr_ca', label: 'fr_ca' },
		],
		APAC: [
			{ value: 'en_xa', label: 'en_xa' },
			{ value: 'ja_jp', label: 'ja_jp' },
			{ value: 'ko_kr', label: 'ko_kr' },
			{ value: 'zh_tw', label: 'zh_tw' },
			{ value: 'en_xp', label: 'en_xp' },
			{ value: 'zh_cn', label: 'zh_cn' },
		],
		LACR: [
			{ value: 'en_xl', label: 'en_xl' },
			{ value: 'es_xl', label: 'es_xl' },
			{ value: 'pt_xl', label: 'pt_xl' },
		],
	};
	$('#region').change(function () {
		const selectedRegion = $(this).val();
		const localeSelect = $('#locale');
		localeSelect.empty().append('<option value="">Select Locale</option>'); // Chain methods
		localeSelect.prop('disabled', true);

		if (selectedRegion && localeOptions[selectedRegion]) {
			const options = localeOptions[selectedRegion];
			options.forEach((option) => {
				localeSelect.append(
					$('<option>', {
						value: option.value,
						text: option.label,
					}),
				);
			});
			localeSelect.prop('disabled', false);
		}
	});

	$('#tealium-form').submit(function (e) {
		e.preventDefault();

		const region = $('#region').val();
		const locale = $('#locale').val();
		const pageType = $('#page-type').val();

		if (!region || !locale || !pageType) {
			alert('Please select Region, Locale, and Page Type.');
			return;
		}

		const generateCode = (env) => {
			const utagUrl = `https://tags.tiqcdn.com/utag/motorola/campaign/${env}/utag.sync.js`;
			const utagData = `var utag_data = {
    msi_platform: 'ceros',
    region: '${region.toLowerCase()}',
    locale: '${locale}',
    page_type: '${pageType}',
};`;
			const utagScript = `(function (a, b, c, d) {
    a = 'https://tags.tiqcdn.com/utag/motorola/campaign/${env}/utag.js';
    b = document;
    c = 'script';
    d = b.createElement(c);
    d.src = a;
    d.type = 'text/java' + c;
    d.async = true;
    a = b.getElementsByTagName(c)[0];
    a.parentNode.insertBefore(d, a);
})();`;

			return `<script src="${utagUrl}"></script>\n\n<script type="text/javascript">\n${utagData}\n</script>\n\n<script type="text/javascript">\n${utagScript}\n</script>`;
		};

		const prodCode = generateCode('prod');
		const nonprodCode = generateCode('qa');

		$('#prod-code').text(prodCode);
		$('#nonprod-code').text(nonprodCode);
		$('#form-container').hide();
		$('#results-container').show();
	});

	$('#copy-prod').click(function () {
		navigator.clipboard.writeText($('#prod-code').text());
		alert('Production code copied to clipboard!');
	});

	$('#copy-nonprod').click(function () {
		navigator.clipboard.writeText($('#nonprod-code').text());
		alert('Non-production code copied to clipboard!');
	});

	$('#start-over').click(function () {
		location.reload();
	});
});
