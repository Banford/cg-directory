var cg = {};

(function(cg, undefined){

    "use strict";
    
    cg.Directory = function(options){
        
        var settings = $.extend({
            triggerText: 'Trigger'
        }, options);
        
        // Private
        var input = $(settings.inputSelector),
            container = $('<div class="cg-directory-dialog"></div>'),
            items = [],
            
            buildTable = function(items){
                var table = $("<table></table>");
                container.append(table);
                
                table.append("<thead><tr><th>x</th><th>Surname</th></tr></thead>");
                var tableBody = $("<tbody></tbody>");
                table.append(tableBody);
                
                for(var i=0; i<items.length; i++){
                    var checkbox = '<input class="cg-directory-checkbox" type="checkbox" value="' + items[i].id + '" />';
                    var checkboxCell = '<td>' + checkbox + '</td>';
                    var dataCell = "<td>" + items[i].surname + "</tr>"
                    
                    tableBody.append('<tr class="cd-directory-item">' + checkboxCell + dataCell + "</td>");   
                }
            },
            
            loadData = function(){
                $.getJSON(settings.dataSource, function(data){
                    items = data.items;
                        
                    buildTable(items);
                    
                    var checkboxes = $('.cg-directory-checkbox');
                    
                    checkboxes.click(selectItem);
                });
            },
            
            updateInput = function(){
                var ids = selectedItems.join(',');
                input.val(ids);
            },
            
            selectItem = function(item){
                selectedItems.push(item.target.value);
                updateInput();
            };
        
        var selectedItems = [], 
        
            init = function(){
            var trigger = '<a href="#" class="cg-trigger">' + settings.triggerText  + '</a>';
            input.after(trigger);
            
            $(".cg-trigger").click(show);
        },
            
        show = function(){
            loadData();
            
            container.dialog({
                title: 'Directory'   
            });
        };
        
        // Public API
        return {
            init: init,
            show: show
        }
        
    };

})(cg || {});

