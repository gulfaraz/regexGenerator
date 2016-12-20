angular.module('sandboxApp', ["ui.ace"])
    .factory("regex", [function () {
        return (function (line, selections) {
            var selectionAsIsRestAsIs = line; // selections - as is  |   rest - as is | 1
            var selectionRegexRestAsIs = ""; // selections - regex  |   rest - as is | 2
            var selectionAsIsRestRegex = ""; // selections - as is  |   rest - regex | 3
            var selectionRegexRestRegex = ""; // selections - regex  |   rest - regex | 4
            var selectionOptimizedRestAsIs = ""; // selections - op regex  |   rest - as is | 5
            var selectionAsIsRestOptimized = ""; // selections - as is  |   rest - op regex | 6
            var selectionOptimizedRestRegex = ""; // selections - op regex  |   rest - regex | 7
            var selectionRegexRestOptimized = ""; // selections - regex  |   rest - op regex | 8
            var selectionOptimizedRestOptimized = ""; // selections - op regex  |   rest - op regex | 9
            var fallbackRegex = "(.*)"; //10

            selectionOptimizedRestOptimized = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += optimizeRegex(convertToRegex(line.substring(cursor, selection[0])));
                    regex += "(" + optimizeRegex(convertToRegex(line.substring(selection[0], selection[1]))) + ")";
                    cursor = selection[1];
                }
                regex += optimizeRegex(convertToRegex(line.substring(cursor, line.length)));
                return regex;
            }();

            selectionRegexRestOptimized = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += optimizeRegex(convertToRegex(line.substring(cursor, selection[0])));
                    regex += "(" + convertToRegex(line.substring(selection[0], selection[1])) + ")";
                    cursor = selection[1];
                }
                regex += optimizeRegex(convertToRegex(line.substring(cursor, line.length)));
                return regex;
            }();

            selectionOptimizedRestRegex = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += convertToRegex(line.substring(cursor, selection[0]));
                    regex += "(" + optimizeRegex(convertToRegex(line.substring(selection[0], selection[1]))) + ")";
                    cursor = selection[1];
                }
                regex += convertToRegex(line.substring(cursor, line.length));
                return regex;
            }();

            selectionAsIsRestOptimized = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += optimizeRegex(convertToRegex(line.substring(cursor, selection[0])));
                    regex += "(" + line.substring(selection[0], selection[1]) + ")";
                    cursor = selection[1];
                }
                regex += optimizeRegex(convertToRegex(line.substring(cursor, line.length)));
                return regex;
            }();

            selectionOptimizedRestAsIs = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += line.substring(cursor, selection[0]);
                    regex += "(" + optimizeRegex(convertToRegex(line.substring(selection[0], selection[1]))) + ")";
                    cursor = selection[1];
                }
                regex += line.substring(cursor, line.length);
                return regex;
            }();

            selectionRegexRestRegex = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += convertToRegex(line.substring(cursor, selection[0]));
                    regex += "(" + convertToRegex(line.substring(selection[0], selection[1])) + ")";
                    cursor = selection[1];
                }
                regex += convertToRegex(line.substring(cursor, line.length));
                return regex;
            }();

            selectionAsIsRestRegex = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += convertToRegex(line.substring(cursor, selection[0]));
                    regex += "(" + line.substring(selection[0], selection[1]) + ")";
                    cursor = selection[1];
                }
                regex += convertToRegex(line.substring(cursor, line.length));
                return regex;
            }();

            selectionRegexRestAsIs = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += line.substring(cursor, selection[0]);
                    regex += "(" + convertToRegex(line.substring(selection[0], selection[1])) + ")";
                    cursor = selection[1];
                }
                regex += line.substring(cursor, line.length);
                return regex;
            }();

            selectionAsIsRestAsIs = function () {
                var regex = "";
                var cursor = 0;
                for(var selectionIndex in selections) {
                    var selection = selections[selectionIndex];
                    regex += line.substring(cursor, selection[0]);
                    regex += "(" + line.substring(selection[0], selection[1]) + ")";
                    cursor = selection[1];
                }
                regex += line.substring(cursor, line.length);
                return regex;
            }();

            //return regex;
            return [
                selectionAsIsRestAsIs,
                selectionRegexRestAsIs,
                selectionAsIsRestRegex,
                selectionRegexRestRegex,
                selectionOptimizedRestAsIs,
                selectionAsIsRestOptimized,
                selectionOptimizedRestRegex,
                selectionRegexRestOptimized,
                selectionOptimizedRestOptimized,
                fallbackRegex
            ];

            function convertToRegex(line) {
                var rawRegex = "";

                for(var charIndex in line) {
                    rawRegex += getRegexChar(line.charCodeAt(charIndex));
                }

                return rawRegex;
            }

            function getRegexChar(char) {
                var regexChar = "";

                if(char === 9) {
                    regexChar = "\\t";
                } else if (char === 10 || char === 13) {
                    regexChar = "\\n";
                } else if (char === 32) {
                    regexChar = "\\s";
                } else if (char == 33) {
                    regexChar = "!";
                } else if ((char > 33 && char < 48) || (char > 57 && char < 65) || (char > 90 && char < 97) || (char > 122 && char < 127)) {
                    regexChar = "\\" + String.fromCharCode(char);
                } else if (char > 47 && char < 58) {
                    regexChar = "\\d";
                } else if ((char > 64 && char < 91) || (char > 96 && char < 123)) {
                    regexChar = "\\w";
                }

                return regexChar;
            }

            function optimizeRegex(rawRegex) {
                var optimizedRegex = "";
                var previousChar = "";
                var currentChar = "";
                var isRecurring = false;

                for(var i=0; i < rawRegex.length; i++) {
                    var char = rawRegex[i];

                    if("\\" === char) {
                        i++;
                        currentChar = "\\" + rawRegex[i];
                        if("s" === rawRegex[i]) {
                            currentChar += "+";
                            isRecurring = true;
                        }
                    } else {
                        currentChar = char;
                    }

                    if (previousChar === currentChar) {
                        if(!isRecurring) {
                            optimizedRegex = optimizedRegex + "+";
                            isRecurring = true;
                        }
                    } else {
                        optimizedRegex += currentChar;
                        previousChar = currentChar;
                        isRecurring = false;
                    }
                }

                return optimizedRegex;
            }
        });
    }])
    .controller('MainCtrl', ['$scope', "$http", "$timeout", "regex", function (scope, http, timeout, regex) {

        scope.listOfRegexes = [];

        scope.aceLoaded = function (editor) {
            var session = editor.getSession(),
                selection = editor.selection;

            editor.setReadOnly(true);
            editor.renderer.setShowGutter(false);
            editor.setShowPrintMargin(false);
            editor.$blockScrolling = Infinity;
            editor.commands.removeCommand("find");

            http.get("file.txt").then(function (response) {
                editor.setValue(response.data, -1);
                editor.setOption("firstLineNumber", 1);
            });

            scope.selectionHandler = function () {
                timeout(function () {
                    scope.disableGenerateRegex = selection.isEmpty() || selection.isMultiLine() || function () {
                        var disable = false;
                        var row = null;
                        angular.forEach(selection.getAllRanges(), function (value, index) {
                            if(!disable) {
                                if(!row) {
                                    if(value.start.row === value.end.row) {
                                        row = value.start.row;
                                    } else {
                                        disable = true;
                                    }
                                } else {
                                    disable = !((value.start.row === value.end.row) && (value.end.row === row));
                                }
                            }
                        });
                        return disable;
                    }();
                });
            };

            scope.generateRegex = function (target) {
                var selectedText = editor.getSelectedText();
                if(selectedText.length > 0) {
                    var selections = [];
                    var ranges = editor.selection.getAllRanges();
                    ranges.map(function (item) {
                        selections.push([ item.start.column, item.end.column ]);
                    });
                    scope.listOfRegexes = regex(session.getLine(ranges[0].start.row), selections);
                    scope[target] = scope.listOfRegexes[0];
                    scope.highlightedRegex = scope[target];
                    scope.updateRegexHighlighting(scope.highlightedRegex);
                }
            };

            scope.setRegexOption = function (regex) {
                scope.highlightedRegex = regex;
                scope.updateRegexHighlighting(scope.highlightedRegex);
            };

            scope.updateRegexHighlighting = function (regexString) {

                var regex,
                    markerClassPrefix = "regex-highlighter-group-";

                removeAllMarkers();
                scope.highlightedRegex = regexString;

                if(regexString) {
                    try {
                        regex = new RegExp(regexString);
                    } catch(e) {
                        regex = null;
                    }
                }

                if(regex) {
                    var lines = editor.getValue(),
                        rangeSetList = getRanges(lines, regex);

                    for(var rangeSetIndex in rangeSetList) {
                        var rangeSet = rangeSetList[rangeSetIndex];
                        for(var rangeIndex in rangeSet) {
                            var range = rangeSet[rangeIndex];
                            session.addMarker(range, markerClassPrefix + (rangeIndex % 10), "line");
                        }
                    }
                }

                function removeAllMarkers() {
                    var markers = session.getMarkers();

                    for(var markerIndex in markers) {
                        var markerObject = markers[markerIndex];

                        if(markerObject.clazz.match(markerClassPrefix)) {
                            session.removeMarker(markerIndex);
                        }
                    }
                }

                function getRanges(lines, regex) {
                    var ranges = [],
                        lineList = lines.split("\n"),
                        aceRange = ace.require("ace/range").Range;

                    for(var lineIndex in lineList) {
                        var lineString = lineList[lineIndex],
                            matchList = regex.exec(lineString);

                        if(matchList && matchList.length > 1) {
                            var lineOffset = 0;

                            matchList = matchList.slice(1, matchList.length);

                            for(var matchIndex in matchList) {
                                var matchString = matchList[matchIndex] || "",
                                    matchStartOffset = lineString.indexOf(matchString),
                                    matchEndOffset = matchStartOffset + matchString.length,
                                    matchStartIndex = lineOffset + matchStartOffset,
                                    matchEndIndex = lineOffset + matchEndOffset;

                                lineOffset += matchEndOffset;
                                lineString = lineString.substring(matchEndOffset);

                                var rangeObject = new aceRange(lineIndex, matchStartIndex, lineIndex, matchEndIndex);

                                if(ranges[lineIndex] && ranges[lineIndex].length > 0) {
                                    ranges[lineIndex].push(rangeObject);
                                } else {
                                    ranges[lineIndex] = [rangeObject];
                                }
                            }
                        }
                    }
                    return ranges;
                }
            };

            selection.on("changeSelection", scope.selectionHandler);
        };
    }]);
