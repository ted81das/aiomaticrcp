"use strict"; 
( function( wp ) {
	var registerPlugin = wp.plugins.registerPlugin;
	var PluginSidebar = wp.editPost.PluginSidebar;
	var el = wp.element.createElement;
    var editing_options = '<option value="" disabled selected>No templates found (use currently saved configuration)</option>';
    if (typeof aiomatic_gut.templates === 'object' && !Array.isArray(aiomatic_gut.templates) && Object.keys(aiomatic_gut.templates).length > 0) {
        editing_options = '<option value="">Use currently saved configuration</option>';
        for (var key in aiomatic_gut.templates) {
            if (aiomatic_gut.templates.hasOwnProperty(key)) {
                editing_options += '<option value="' + key + '">' + aiomatic_gut.templates[key] + '</option>';
            }
        }
    }
	registerPlugin( 'aiomatic-sidebar', {
		render: function() {
            function updateMessage( ) {
                var postId = wp.data.select("core/editor").getCurrentPostId();
                if (confirm("Are you sure you want to submit this post now?") == true) {
                    document.getElementById('aiomatic_submit_post').setAttribute('disabled','disabled');
                    document.getElementById('aiomatic_toggle_post').setAttribute('disabled','disabled');
                    document.getElementById("aiomatic_span").innerHTML = 'Processing status: Working... (please do not close or refresh this page) ';
                    var editor_select_template = jQuery('#editor_select_template').val();
                    if(editor_select_template == null)
                    {
                        editor_select_template = '';
                    }
                    var data = {
                         action: 'aiomatic_post_now',
                         nonce: aiomatic_gut.nonce,
                         template: editor_select_template,
                         id: postId
                    };
                    jQuery.post(aiomatic_gut.ajaxurl, data, function(response) {
                        document.getElementById('aiomatic_submit_post').removeAttribute('disabled');
                        document.getElementById('aiomatic_toggle_post').removeAttribute('disabled');
                        document.getElementById("aiomatic_span").innerHTML = 'Processing status: Done! ';
                        location.reload();
                    }).fail( function(xhr) 
                    {
                        document.getElementById("aiomatic_span").innerHTML = 'Error, please check the plugin\'s \'Activity and Logging\' menu for details!';
                        console.log('Error occured in processing: ' + xhr.statusText + ' - please check plugin\'s \'Activity and Logging\' menu for details.');
                    });
                } else {
                    return;
                }
            }
            function toggleStatus( ) {
                var postId = wp.data.select("core/editor").getCurrentPostId();
                if (confirm("Are you sure you want to toggle the processing status of this post?") == true) {
                    document.getElementById('aiomatic_submit_post').setAttribute('disabled','disabled');
                    document.getElementById('aiomatic_toggle_post').setAttribute('disabled','disabled');
                    document.getElementById("aiomatic_span").innerHTML = 'Processing status: Working... (please do not close or refresh this page) ';
                    var data = {
                         action: 'aiomatic_toggle_status',
                         nonce: aiomatic_gut.nonce,
                         id: postId
                    };
                    jQuery.post(aiomatic_gut.ajaxurl, data, function(response) {
                        document.getElementById('aiomatic_submit_post').removeAttribute('disabled');
                        document.getElementById('aiomatic_toggle_post').removeAttribute('disabled');
                        document.getElementById("aiomatic_span").innerHTML = 'Processing status: Done! ';
                        location.reload();
                    }).fail( function(xhr) 
                    {
                        document.getElementById('aiomatic_submit_post').removeAttribute('disabled');
                        document.getElementById('aiomatic_toggle_post').removeAttribute('disabled');
                        document.getElementById("aiomatic_span").innerHTML = 'Error, please check the plugin\'s \'Activity and Logging\' menu for details!';
                        console.log('Error occured in processing: ' + xhr.statusText + ' - please check plugin\'s \'Activity and Logging\' menu for details.');
                    });
                } else {
                    return;
                }
            }
            var poststat = 'Post is not yet edited with Aiomatic.';
            if(aiomatic_gut.metavalue == 'pub')
            {
                poststat = 'Post is edited with Aiomatic.';
            }
            return el(PluginSidebar, {
                name: 'aiomatic-sidebar',
                icon: 'text',
                title: 'Aiomatic AI Content Writer',
            },
            el('div', { className: 'coderevolution_gutenberg_div' },
                el('h4', { className: 'coderevolution_gutenberg_title' }, 'Manual AI Editing for This Post'),
                el('p', { className: 'coderevolution_gutenberg_description' },
                    'Edit the post using the selected template or the settings configured in the AI Content Editor plugin menu.'
                ),
                el('label', { className: 'coderevolution_gutenberg_label' }, 'Select AI Content Editor Template:'),
                el('select', {
                    id: 'editor_select_template',
                    className: 'coderevolution_gutenberg_select',
                    dangerouslySetInnerHTML: { __html: editing_options }
                }),
                el(
                    'br'
                ),
                el(
                    'br'
                ),
                el('input', {
                    type: 'button',
                    id: 'aiomatic_submit_post',
                    value: 'Process with Aiomatic',
                    onClick: updateMessage,
                    className: 'coderevolution_gutenberg_button button button-primary'
                })
            ),
            el('div', { className: 'coderevolution_gutenberg_div' },
                el('h4', { className: 'coderevolution_gutenberg_title' }, 'Aiomatic Editing Status'),
                el('p', { className: 'coderevolution_gutenberg_status' }, poststat),
                el('input', {
                    type: 'button',
                    id: 'aiomatic_toggle_post',
                    value: 'Toggle Processing Status',
                    onClick: toggleStatus,
                    className: 'coderevolution_gutenberg_button button button-secondary'
                })
            ),
            el('div', { id:'aiomatic_span', className: 'coderevolution_gutenberg_status' },
                'Processing status: idle'
            )
        );
		},
	} );
} )( window.wp );