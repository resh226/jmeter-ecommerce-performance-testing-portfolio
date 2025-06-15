/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8923076923076924, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "07 - Add to Cart-1"], "isController": false}, {"data": [0.95, 500, 1500, "03 - Login User-0"], "isController": false}, {"data": [1.0, 500, 1500, "04 - View Products"], "isController": false}, {"data": [1.0, 500, 1500, "02 - Open Login Page"], "isController": false}, {"data": [1.0, 500, 1500, "03 - Login User-1"], "isController": false}, {"data": [1.0, 500, 1500, "07 - Add to Cart-0"], "isController": false}, {"data": [0.95, 500, 1500, "08 - View Cart"], "isController": false}, {"data": [0.5, 500, 1500, "07 - Add to Cart"], "isController": false}, {"data": [1.0, 500, 1500, "05 - Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "03 - Login User"], "isController": false}, {"data": [1.0, 500, 1500, "06 - View Product"], "isController": false}, {"data": [0.7, 500, 1500, "01 - Open Homepage"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130, 0, 0.0, 403.676923076923, 0, 1644, 324.5, 739.3000000000001, 843.5499999999995, 1531.7799999999993, 5.934447183420067, 167.76051830834018, 2.3466744270975988], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["07 - Add to Cart-1", 10, 0, 0.0, 335.5, 318, 372, 325.0, 371.7, 372.0, 372.0, 2.9308323563892147, 152.63110895369286, 0.844331587045721], "isController": false}, {"data": ["03 - Login User-0", 10, 0, 0.0, 440.29999999999995, 406, 533, 431.0, 528.6, 533.0, 533.0, 2.832058906825262, 2.4874548640611724, 1.9774630062305296], "isController": false}, {"data": ["04 - View Products", 10, 0, 0.0, 321.20000000000005, 313, 330, 320.0, 329.8, 330.0, 330.0, 2.9806259314456036, 142.338277757079, 0.7567995529061103], "isController": false}, {"data": ["02 - Open Login Page", 10, 0, 0.0, 287.7, 282, 296, 285.0, 295.9, 296.0, 296.0, 2.9351335485764602, 20.759763905195186, 0.610530708834752], "isController": false}, {"data": ["03 - Login User-1", 10, 0, 0.0, 332.4, 312, 370, 328.0, 367.6, 370.0, 370.0, 2.9708853238265003, 154.7216187611408, 1.7581606506238858], "isController": false}, {"data": ["07 - Add to Cart-0", 10, 0, 0.0, 285.40000000000003, 272, 303, 285.0, 302.4, 303.0, 303.0, 2.9922202274087373, 2.190398713345302, 0.9263025508677438], "isController": false}, {"data": ["08 - View Cart", 10, 0, 0.0, 366.5, 292, 612, 337.0, 592.3000000000001, 612.0, 612.0, 2.913752913752914, 26.456250455273892, 0.7426655375874126], "isController": false}, {"data": ["07 - Add to Cart", 10, 0, 0.0, 621.2, 595, 656, 614.5, 655.3, 656.0, 656.0, 2.7063599458728014, 142.9222344384303, 1.6174729364005414], "isController": false}, {"data": ["05 - Search Product", 10, 0, 0.0, 323.6, 308, 363, 315.5, 361.9, 363.0, 363.0, 2.9904306220095696, 81.39344721889952, 0.7914127915669856], "isController": false}, {"data": ["Debug Sampler", 10, 0, 0.0, 0.6, 0, 4, 0.0, 3.700000000000001, 4.0, 4.0, 2.2476961114857272, 0.7037220442796134, 0.0], "isController": false}, {"data": ["03 - Login User", 10, 0, 0.0, 773.3, 724, 865, 755.0, 861.1, 865.0, 865.0, 2.5933609958506225, 137.33821884725103, 3.3455369878112036], "isController": false}, {"data": ["06 - View Product", 10, 0, 0.0, 309.09999999999997, 299, 325, 306.0, 324.7, 325.0, 325.0, 2.976190476190476, 38.284156436011905, 0.7818312872023809], "isController": false}, {"data": ["01 - Open Homepage", 10, 0, 0.0, 850.9999999999999, 417, 1644, 785.5, 1607.8000000000002, 1644.0, 1644.0, 2.097315436241611, 108.34682387793625, 0.25397179110738255], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
