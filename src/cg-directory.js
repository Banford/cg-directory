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
                var index = selectedItems.indexOf(data.id.toString());
                var isChecked = index > -1;
                var checked = isChecked ? 'checked="checked"' : '';
                
                var checkbox = '<input class="' + checkboxClass + '" type="checkbox" ' + checked + ' value="' 
                    + data.id + '" data-display="' + data.firstname + ' ' + data.surname + '" />';
                
                
                var checkboxCell = '<td>' + checkbox + '</td>';
                
                var dataCells = "";
                // TODO: Make this dynamic
                dataCells += "<td>" + data.firstname + "</td>";
                dataCells += "<td>" + data.surname + "</td>";
                
                return '<tr class="cd-directory-item">' + checkboxCell + dataCells + "</tr>";
            },
            
            buildTable = function(headings, items){
                var table = $("<table></table>");
                container.append(table);
                
                var headingsHtml = "";
                for(var h=0; h<headings.length; h++){          
                    headingsHtml += "<th>" + headings[h] + "</th>"   
                }
                
                table.append("<thead><tr><th>&nbsp;</th>" + headingsHtml + "</tr></thead>");
                var tableBody = $("<tbody></tbody>");
                table.append(tableBody);
                
                for(var i=0; i<items.length; i++){          
                    var row = buildTableRow(items[i]);
                    tableBody.append(row);   
                }
            },
            
            buildPagingLinks = function(pagingInfo, container){
                  
                if(pagingInfo.pages < 2) return;
                           
                if(pagingInfo.currentPage > 1) {
                    var previousPageLink = $('<a class="cg-directory-prev-link" href="#">Previous Page</a>');
                    
                    previousPageLink.click(function(){
                        var previousPageNumber = pagingInfo.currentPage - 1;
                        loadData(settings.dataSource + "?page=" + previousPageNumber)
                    });
                    
                    container.append(previousPageLink);
                }
                
                if(pagingInfo.currentPage < pagingInfo.pages){
                    var nextPageLink = $('<a class="cg-directory-next-link" href="#">Next Page</a>');
                
                    nextPageLink.click(function(){
                        var nextPageNumber = pagingInfo.currentPage + 1;
                        loadData(settings.dataSource + "?page=" + nextPageNumber)
                    });
                    
                    container.append(nextPageLink);   
                }
            },
            
            loadData = function(url){
                container.html("");
                
                if(!url) url = settings.dataSource;
                
                $.getJSON(url, function(data){
                    buildTable(data.headings, data.items);
                    
                    var checkboxes = $('.cg-directory-checkbox');   
                    checkboxes.click(toggleItem);
                    
                    buildPagingLinks(data.pagingInfo, container);
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

