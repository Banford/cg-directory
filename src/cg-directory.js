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
            displayList = $("<ul></ul>"),
            items = [],
            
            checkboxClass = "cg-directory-checkbox",
            
            buildTableRow = function(data){
                var checkbox = '<input class="' + checkboxClass + '" type="checkbox" value="' 
                    + data.id + '" data-display="' + data.surname + '" />';
                var checkboxCell = '<td>' + checkbox + '</td>';
                var dataCell = "<td>" + data.surname + "</tr>"
                return '<tr class="cd-directory-item">' + checkboxCell + dataCell + "</td>";
            },
            
            buildTable = function(items){
                var table = $("<table></table>");
                container.append(table);
                
                table.append("<thead><tr><th>x</th><th>Surname</th></tr></thead>");
                var tableBody = $("<tbody></tbody>");
                table.append(tableBody);
                
                for(var i=0; i<items.length; i++){          
                    var row = buildTableRow(items[i]);
                    tableBody.append(row);   
                }
            },
            
            loadData = function(){
                container.html("");
                
                $.getJSON(settings.dataSource, function(data){
                    items = data.items;
                        
                    buildTable(items);
                    
                    var checkboxes = $('.cg-directory-checkbox');
                    
                    checkboxes.click(toggleItem);
                    
                    console.log(selectedItems);
                });
            },
            
            updateInput = function(){
                var ids = selectedItems.join(',');
                input.val(ids);
            },
            
            updateDisplay = function(){
                displayList.html("");
                
                for(var i=0; i < selectedItemDisplay.length; i++){
                    displayList.append("<li>" + selectedItemDisplay[i] + "</li>");   
                }
            },
            
            toggleItem = function(item){
                var isChecked = item.target.checked;
                var value = item.target.value;
                var displayText = item.target.getAttribute("data-display");
                
                if(isChecked){   
                    selectedItems.push(value);
                    selectedItemDisplay.push(displayText);
                } else {
                    var index = selectedItems.indexOf(value);
                    selectedItems.splice(index, 1);
                    
                    var displayIndex = selectedItemDisplay.indexOf(displayText);
                    selectedItemDisplay.splice(displayIndex, 1);
                }
                
                updateInput();
                updateDisplay();
            };
        
        var selectedItems = [], 
        
            init = function(){
                var trigger = $('<a href="#" class="cg-trigger">' + settings.triggerText  + '</a>');
                input.after(trigger);
                trigger.after(displayList);
            
                $(".cg-trigger").click(show);
            },
            
            selectedItemDisplay = [],
            
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

