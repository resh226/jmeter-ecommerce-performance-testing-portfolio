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

    var data = {"OkPercent": 92.46153846153847, "KoPercent": 7.538461538461538};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5969230769230769, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.91, 500, 1500, "07 - Add to Cart-1"], "isController": false}, {"data": [0.09, 500, 1500, "03 - Login User-0"], "isController": false}, {"data": [0.53, 500, 1500, "04 - View Products"], "isController": false}, {"data": [0.66, 500, 1500, "02 - Open Login Page"], "isController": false}, {"data": [0.23, 500, 1500, "03 - Login User-1"], "isController": false}, {"data": [0.94, 500, 1500, "07 - Add to Cart-0"], "isController": false}, {"data": [1.0, 500, 1500, "08 - View Cart"], "isController": false}, {"data": [0.5, 500, 1500, "07 - Add to Cart"], "isController": false}, {"data": [0.57, 500, 1500, "05 - Search Product"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.0, 500, 1500, "03 - Login User"], "isController": false}, {"data": [0.8, 500, 1500, "06 - View Product"], "isController": false}, {"data": [0.53, 500, 1500, "01 - Open Homepage"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 650, 49, 7.538461538461538, 1013.0784615384607, 0, 4454, 632.5, 2192.3999999999996, 3149.1999999999975, 4131.76, 20.26184538653367, 572.7722320176123, 8.012196072319203], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["07 - Add to Cart-1", 50, 0, 0.0, 403.3, 312, 697, 356.5, 616.3, 660.1499999999997, 697.0, 5.679881858457343, 295.79781928035896, 1.6362940900829261], "isController": false}, {"data": ["03 - Login User-0", 50, 0, 0.0, 1865.8799999999997, 717, 2951, 1853.5, 2539.2, 2739.0499999999993, 2951.0, 3.9240307644011927, 3.4467092097002037, 2.7399238247527857], "isController": false}, {"data": ["04 - View Products", 50, 0, 0.0, 1090.0000000000005, 319, 1987, 1199.5, 1742.1999999999996, 1886.8, 1987.0, 4.163544008660171, 198.8267913648097, 1.0571498459488717], "isController": false}, {"data": ["02 - Open Login Page", 50, 0, 0.0, 867.0200000000002, 282, 1740, 1022.0, 1491.1, 1617.0999999999997, 1740.0, 4.606172270842929, 32.573015027637034, 0.9581198180561953], "isController": false}, {"data": ["03 - Login User-1", 50, 0, 0.0, 1554.12, 769, 2193, 1547.0, 2031.6, 2151.25, 2193.0, 3.9311266609010147, 204.72762513267554, 2.326428473150405], "isController": false}, {"data": ["07 - Add to Cart-0", 50, 0, 0.0, 335.46, 275, 647, 290.5, 613.1999999999998, 633.8499999999999, 647.0, 5.703855806525211, 4.1613638632215375, 1.765744424480949], "isController": false}, {"data": ["08 - View Cart", 50, 0, 0.0, 314.6999999999999, 291, 383, 306.0, 350.7, 370.59999999999997, 383.0, 5.710370031978072, 51.86298591679991, 1.455475174166286], "isController": false}, {"data": ["07 - Add to Cart", 50, 0, 0.0, 739.0199999999999, 590, 1320, 654.5, 1211.3999999999999, 1261.05, 1320.0, 5.498130635583902, 290.3438221629646, 3.2859921376731913], "isController": false}, {"data": ["05 - Search Product", 50, 0, 0.0, 920.7399999999997, 313, 2402, 719.0, 1876.8, 2027.4999999999986, 2402.0, 4.575402635431918, 124.52726796989384, 1.210873158400439], "isController": false}, {"data": ["Debug Sampler", 50, 0, 0.0, 0.19999999999999993, 0, 3, 0.0, 1.0, 1.0, 3.0, 5.1663566852655505, 1.618421774901839, 0.0], "isController": false}, {"data": ["03 - Login User", 50, 42, 84.0, 3420.3799999999997, 2339, 4454, 3380.0, 4154.8, 4334.75, 4454.0, 3.700414446417999, 195.96274665575044, 4.7736791833185315], "isController": false}, {"data": ["06 - View Product", 50, 0, 0.0, 546.7199999999999, 308, 1870, 357.5, 1090.5999999999995, 1837.9499999999998, 1870.0, 4.839334107626791, 62.24877050667828, 1.2712703856949283], "isController": false}, {"data": ["01 - Open Homepage", 50, 7, 14.0, 1112.4799999999998, 403, 2522, 1059.0, 2041.0, 2105.1499999999996, 2522.0, 4.357678229039568, 225.11833819940736, 0.5276875980477601], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,286 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,144 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,066 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,363 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,021 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,051 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,120 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,036 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,462 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,075 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,907 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,454 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,156 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,032 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,169 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,991 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,409 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,212 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,372 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,546 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,963 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,826 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,120 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,213 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,133 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,100 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,561 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,033 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,335 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,035 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,437 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,906 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,102 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,301 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,003 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,376 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,728 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,501 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,286 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,153 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,439 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,042 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,025 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 4,047 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,522 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 2,027 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,490 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}, {"data": ["The operation lasted too long: It took 3,834 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 2.0408163265306123, 0.15384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 650, 49, "The operation lasted too long: It took 3,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,286 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,144 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 2,066 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 3,363 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["03 - Login User", 50, 42, "The operation lasted too long: It took 3,035 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,388 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 4,286 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,437 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 3,906 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["01 - Open Homepage", 50, 7, "The operation lasted too long: It took 2,153 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,522 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,027 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,066 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, "The operation lasted too long: It took 2,032 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
