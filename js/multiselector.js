function MultiSelector(target, file_input, opts)
{

    var that = this;
    var inner_files = [];
    var accept = opts.ext_allowed ? '.' + opts.ext_allowed.split(/\|/).join(',.') : null;
    if(accept) $(file_input).attr('accept', accept);

    this.addFile = function(file)
    {
        console.log(file);

        var idx = inner_files.length,
            id = 'pub_file_' + idx.toString(),
            ext = file.type.split("/").pop();

        var li = $('<li class="xrow d-flex flex-wrap align-items-center justify-content-between"></li>'),
            icon = $('<div class="icon"><i class="fas fa-file"></i> <span>.'+ext+'</span></div>'),
            name = $('<h4 class="xfname">'),
            info = $('<div class="information">'),
            size = $('<span class="xfsize">'),
            //var descr = $('<input type="text" class="fdescr" maxlength="48" name="file_descr">');
            is_public = $('<div class="custom-control custom-checkbox"><input type="checkbox" id="'+id+'" value="1" class="selall custom-control-input" name="file_public"><label class="custom-control-label" for="'+id+'">Public</label></div>'),
            //var is_public_label = $('<label class="xdescr">Public</label>');
            del = $('<a href="#" title="Delete" class="delete"><i class="far fa-trash-alt"></i></a>');

        $(name).html(file.name);
        $(size).html('(' + convertSize(file.size) + ')');

        if(opts.file_public_default == 1) $(id).attr('checked', 'true');

        $(del).click(function()
        {
            $(li).remove();
            inner_files[idx] = undefined;
            if($.grep(inner_files, function(e) { return e != undefined }).length == 0)
            {
                $(file_input).parent().css('display', '');
                $('#file_0').get(0).value = ""; // Prevent from being passed to FileUploader
                $('.upload-file').removeClass('d-flex').addClass('d-none');
                $('#upload_controls').remove();
            }
        });

        if(opts.max_upload_files > 0 && $(target).find('.xrow').length >= opts.max_upload_files)
        {
            alert("No remaining slots");
            return;
        }

        if(checkExt(file) && checkSize(file))
        {
            $(info).append(name, size);
            $(li).append(icon, info, is_public, del);
            $(target).append(li);
            inner_files.push(file);

            $(file_input).parent().css('display', 'none');
            $(target).css('display', '');
            $('.upload-file').removeClass('d-none').addClass('d-flex');

            that.files_added++;
            return true;
        }
        
        return false;

    };

    var addFileCallback = function(event)
    {
        that.files_added = 0;
        $(this.files).each(function(i, file)
        {
            that.addFile(file);
        });
    };

    var installUploadControls = function()
    {
        var bottom = $('<div class="upload-controls d-flex align-items-center justify-content-between flex-wrap" id="upload_controls">');
        var start_upload = $('<input type="button" class="btn btn-primary" value="Start upload">');
        var add_more = $('<label class="btn btn-default" for="add_more">Add more</label>');
        var add_more_finput = $('<input type="file" id="add_more">');

        //var show_advanced_container = $('<div id="show_advanced" style="width: 485px;"></div>');
        //var show_advanced = $('<a href="#">Show advanced</a>');
        //show_advanced_container.append(show_advanced);

        // $(show_advanced).click(function() { 
        //     $('#advanced_opts').show();
        //     $(this).hide();
        // });

        bottom.append(add_more);
        bottom.append(add_more_finput);
        bottom.append(start_upload);

        setTimeout(function()
        {
	        $(add_more_finput).css('left', $(add_more).position().left);
	        $(add_more_finput).css('position', 'absolute');
	        $(add_more_finput).css('opacity', 0);
        }, 0);

        $(start_upload).click(function(e)
        {
           var files = $.grep(inner_files, function(e) { return e != undefined });
           if(opts.oncomplete) opts.oncomplete(files);

            $('.upload-file').find('.col-md-4, .col-md-8').addClass('d-none');
            $('#upload_controls').remove();
           //$('#advanced_opts').hide();
           e.preventDefault();
        });

        $(add_more_finput).change(addFileCallback);
        if(accept) $(add_more_finput).attr('accept', accept);
        //$(target).parent().append(show_advanced_container);
        $(target).parent().append(bottom);
    };

    this.installUploadControls = installUploadControls;

	var checkExt = function(file)
	{
	    if(file.name=="")return true;
	    var re1 = new RegExp("^.+\.("+opts.ext_allowed+")$","i");
	    var re2 = new RegExp("^.+\.("+opts.ext_not_allowed+")$","i");
	    if( (opts.ext_allowed && !re1.test(file.name)) || (opts.ext_not_allowed && re2.test(file.name)) )
	    {
	        str='';
	        if(opts.ext_allowed)str+="\nOnly these extensions are allowed: "+opts.ext_allowed.replace(/\|/g,',');
	        if(opts.ext_not_allowed)str+="\nThese extensions are not allowed:"+opts.ext_not_allowed.replace(/\|/g,',');                             
	        alert("Extension not allowed for file: \"" + file.name + '"'+str);
	        return false;
	    }
	
	    return true;
	}

    var checkSize = function(obj)
    {
        if(obj.name=='')return true;
        if(!opts.max_upload_filesize || opts.max_upload_filesize==0) return true;
        if(obj.size>0 && obj.size>opts.max_upload_filesize*1024*1024)
        {
            alert("File size limit is "+opts.max_upload_filesize+" Mbytes");
            return false;
        }
        return true;
    }

    $(file_input).change(addFileCallback);
    $(file_input).change(installUploadControls);
}

function convertSize(size)
{
    if (size > 1024*1024*1024) {
            size = Math.round(size/(1024*1024*1024)*10)/10 + " Gb";
    } else if (size > 1024*1024) {
            size = Math.round(size/(1024*1024)*10)/10+'';
            if(!size.match(/\./))size+='.0';
            size+=' Mb';
    } else if(size > 1024) {
            size = Math.round(size/1024*10)/10 + " Kb";
    } else {
            size = size + " Bytes";
    }
    return size;
}
