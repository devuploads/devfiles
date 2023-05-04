function loadDialog(title, url, postdata)
{
	var dialog = $("<div>");
	$(dialog).attr('title', title);

	$.ajax({ url: url,
		method: postdata ? 'POST' : 'GET',
		success: function(res)
		{
			var w = $(window).width();
			var h = $(window).height();

			$(dialog).html(res);
			$(dialog).dialog({ modal: true, width: 'auto', height: 'auto' })
		},
		data: postdata
	});
}
