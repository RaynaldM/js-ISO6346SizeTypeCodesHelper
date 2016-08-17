var ContainerHelpers = (function () {
    function ContainerHelpers() {
    }
    ContainerHelpers.InitTypeHelper = function (selector) {
        var _this = this;
        if (selector === void 0) { selector = ".cnt-helpers-type"; }
        // search if modal is present or not
        if (!$("#cnt-modal-type").length) {
            // load and inject it
            $.get("html/_cnt-modal.min.html").done(function (html) {
                $("body").append(html);
            });
        }
        var groups = $(selector);
        $.each(groups, function (index, item) {
            var group = $(item);
            // find the helpblock 
            var helpBlock = group.next(".help-block");
            // find & set the input behavior
            var input = group.find("input.form-control");
            input.off("input change")
                .on("input change", function () {
                // get previous value
                var value = input.val();
                helpBlock.text(_this.findLabel(value));
            });
            // find & set the button
            var button = group.find(".btn");
            button.off("click")
                .on("click", function () {
                var modalWindow = $("#cnt-modal-type");
                var settedValue = _this.splitInput(input.val());
                _this.prepareModal(modalWindow, input, settedValue[0], settedValue[1], settedValue[2], settedValue[3]);
                modalWindow.modal("show");
            });
        });
    };
    ContainerHelpers.findLabel = function (search) {
        if (!search)
            return "Undefined Container Type";
        var code = search.charAt(0);
        var result = this.lengthDictonary[code] || "Unknow";
        if (search.length > 1) {
            code = search.charAt(1);
            result += " [" + (this.heightDictonary[code] || "Unknow") + "]";
            if (search.length === 3) {
                code = search.charAt(2);
                result += " - " + (this.typeCategories[code] || "Unknow");
            }
            if (search.length > 3) {
                code = search.substr(2, 2);
                result += " - " + (this.typeGroups[code] || "Unknow");
            }
            if (search.length > 4) {
                result += "  *** Code is too long";
            }
        }
        return result;
    };
    ContainerHelpers.splitInput = function (value) {
        var result = new Array("2", "2", "G", "G0");
        if (value) {
            result[0] = value.charAt(0);
            if (value.length > 1) {
                result[1] = value.charAt(1);
                if (value.length > 2) {
                    result[2] = value.charAt(2);
                }
                if (value.length > 3) {
                    result[3] = value.substr(2, 2);
                }
            }
        }
        return result;
    };
    ContainerHelpers.prepareModal = function (modal, input, selectedLenght, selectedheight, checkedType, checkedDetailType) {
        var _this = this;
        var html = "";
        // setup lenghtDropdown
        this.setDropdown(this.lengthDictonary, selectedLenght, "#select-length", modal);
        // setup heightDropdown
        this.setDropdown(this.heightDictonary, selectedheight, "#select-height", modal);
        // setup type categories radiobutton
        for (var item in this.typeCategories) {
            var checked = item === checkedType ? "checked" : "";
            var active = checked ? "active" : "";
            html += this.format(this.typeCategoriesTemplate, item, this.typeCategories[item], checked, active);
        }
        ;
        var group = modal.find("#typecat-RadioGroup");
        // and inject them
        group.html(html);
        // setup type details
        this.setTypeDetails(checkedType, checkedDetailType, modal);
        // set result with default params
        this.setResult();
        // set behaviors
        // for Typecategories
        $("#typecat-RadioGroup")
            .off("change")
            .on("change", function () {
            // get the selected value
            var value = $("input[name=tc-radio]:checked").val();
            // re-construct the type details
            _this.setTypeDetails(value, null, modal);
            _this.setResult();
        });
        // for select button
        $("#cnt-modal-select-btn")
            .off("click")
            .on("click", function () {
            input.val(_this.setResult());
            modal.modal("hide");
            input.trigger("change");
        });
    };
    ContainerHelpers.setTypeDetails = function (checkedType, checkedDetailType, modal) {
        var _this = this;
        var html = "";
        // setup type details radiobutton
        var filteredGroup = Object.keys(this.typeGroups).filter(function (key) {
            return key.indexOf(checkedType, 0) === 0;
        });
        filteredGroup.forEach(function (item) {
            var checked = item === checkedDetailType ? "checked" : "";
            var active = checked ? "active" : "";
            html += _this.format(_this.typeTemplate, item, _this.typeGroups[item], checked, active);
        });
        var group = modal.find("#type-RadioGroup");
        // and inject them
        group.html(html);
        // set behavior
        $("#type-RadioGroup")
            .off("change")
            .on("change", function () {
            _this.setResult();
        });
    };
    ContainerHelpers.setDropdown = function (dico, selectedItem, element, modal) {
        var _this = this;
        var html = "";
        // setupdropdown
        for (var item in dico) {
            var selected = item === selectedItem ? "selected" : "";
            if (item.substr(0, 1) === "X") {
                html += this.format("<option disabled value>{0}</option>", dico[item]);
            }
            else {
                html += this.format("<option value='{0}' {2}>[{0}] - {1}</option>", item, dico[item], selected);
            }
        }
        var group = modal.find(element);
        // inject options
        group.html(html);
        // set behavior
        group.off("change")
            .on("change", function () {
            _this.setResult();
        });
    };
    ContainerHelpers.setResult = function () {
        var length = $("#select-length").val();
        var height = $("#select-height").val();
        var category = $("input[name=tc-radio]:checked").val();
        var detail = $("input[name=t-radio]:checked").val();
        var search = length + height + (detail ? detail : category);
        $("#cnt-result-label").text(this.findLabel(search));
        $("#cnt-result").text(search);
        return search;
    };
    ContainerHelpers.format = function (formatted) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            data[_i - 1] = arguments[_i];
        }
        for (var i = 0; i < data.length; i++) {
            var regexp = new RegExp("\\{" + i + "\\}", "gi");
            formatted = formatted.replace(regexp, data[i]);
        }
        return formatted;
    };
    // container definition come from 
    // https://en.wikipedia.org/wiki/ISO_6346#Size_and_Type_Codes
    ContainerHelpers.lengthDictonary = {
        "1": "10'",
        "2": "20'",
        "3": "30'",
        "4": "40'",
        "B": "24'",
        "C": "24'6''",
        "G": "41'",
        "H": "43'",
        "L": "45'",
        "M": "48'",
        "N": "49'"
    };
    ContainerHelpers.heightDictonary = {
        "X0": "--- Width 8'",
        "0": "8'",
        "2": "8'6''",
        "4": "9'",
        "5": "9'6'''",
        "6": "> 9'6''",
        "8": "4'3''",
        "9": "<= 4'",
        "X1": "--- Width 2348mm < x <= 2500mm",
        "C": "8'6'''",
        "D": "9'",
        "E": "9'6''",
        "F": "> 9'6''"
    };
    ContainerHelpers.typeGroups = {
        "G0": "General - Openings at one or both ends",
        "G1": "General - Passive vents at upper part of cargo space",
        "G2": "General - Openings at one or both ends + full openings on one or both sides",
        "G3": "General - Openings at one or both ends + partial openings on one or both sides",
        "V0": "Fantainer - Non - mechanical, vents at lower and upper parts of cargo space",
        "V2": "Fantainer - Mechanical ventilation system located internally",
        "V4": "Fantainer - Mechanical ventilation system located externally",
        "R0": "Integral Reefer - Mechanically refrigerated",
        "R1": "Integral Reefer - Mechanically refrigerated and heated",
        "R2": "Integral Reefer - Self - powered mechanically refrigerated",
        "R3": "Integral Reefer - Self - powered mechanically refrigerated and heated",
        "H0": "Refrigerated or heated with removable equipment located externally; heat transfer coefficient K= 0.4W/ M2.K",
        "H1": "Refrigerated or heated with removable equipment located internally",
        "H2": "Refrigerated or heated with removable equipment located externally; heat transfer coefficient K= 0.7W/ M2.K",
        "H5": "Insulated - Heat transfer coefficient K= 0.4W/ M2.K",
        "H6": "Insulated - Heat transfer coefficient K= 0.7W/ M2.K",
        "U0": "Open Top - Openings at one or both ends",
        "U1": "Open Top - Idem + removable top members in end frames",
        "U2": "Open Top - Openings at one or both ends + openings at one or both sides",
        "U3": "Open Top - Idem + removable top members in end frames",
        "U4": "Open Top - Openings at one or both ends + partial on one and full at other side",
        "U5": "Open Top - Complete, fixed side and end walls (no doors )",
        "T0": "Tank - Non dangerous liquids, minimum pressure 0.45 bar",
        "T1": "Tank - Non dangerous liquids, minimum pressure 1.50 bar",
        "T2": "Tank - Non dangerous liquids, minimum pressure 2.65 bar",
        "T3": "Tank - Dangerous liquids, minimum pressure 1.50 bar",
        "T4": "Tank - Dangerous liquids, minimum pressure 2.65 bar",
        "T5": "Tank - Dangerous liquids, minimum pressure 4.00 bar",
        "T6": "Tank - Dangerous liquids, minimum pressure 6.00 bar",
        "T7": "Tank - Gases, minimum pressure 9.10 bar",
        "T8": "Tank - Gases, minimum pressure 22.00 bar",
        "T9": "Tank - Gases, minimum pressure to be decided",
        "B0": "Bulk - Closed",
        "B1": "Bulk - Airtight",
        "B3": "Bulk - Horizontal discharge, test pressure 1.50 bar",
        "B4": "Bulk - Horizontal discharge, test pressure 2.65 bar",
        "B5": "Bulk - Tipping discharge, test pressure 1.50 bar",
        "B6": "Bulk - Tipping discharge, test pressure 2.65 bar",
        "P0": "Flat or Bolster - Plain platform",
        "P1": "Flat or Bolster - Two complete and fixed ends",
        "P2": "Flat or Bolster - Fixed posts, either free- standing or with removable top member",
        "P3": "Flat or Bolster - Folding complete end structure",
        "P4": "Flat or Bolster - Folding posts, either free- standing or with removable top member",
        "P5": "Flat or Bolster - Open top, open ends (skeletal)",
        "S0": "Livestock carrier",
        "S1": "Automobile carrier",
        "S2": "Live fish carrier"
    };
    ContainerHelpers.typeCategories = {
        "G": "General",
        "V": "Fantainer",
        "R": "Integral Reefer",
        "H": "Refrigerated",
        "U": "Open Top",
        "T": "Tank",
        "B": "Bulk",
        "P": "Flat or Bolster",
        "S": "Special"
    };
    ContainerHelpers.typeCategoriesTemplate = "<label class='btn btn-default col-md-3 {3}'><input type='radio' name='tc-radio' value='{0}' autocomplete='off' {2}>{1}</label>";
    ContainerHelpers.typeTemplate = "<div class='radio'><label><input type='radio' name='t-radio' value='{0}' {2}>{1}</label></div>";
    return ContainerHelpers;
}());
//# sourceMappingURL=containerhelpers.js.map