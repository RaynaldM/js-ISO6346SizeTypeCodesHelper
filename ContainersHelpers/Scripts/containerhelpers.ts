class ContainerHelpers {
    // container definition come from 
    // https://en.wikipedia.org/wiki/ISO_6346#Size_and_Type_Codes

    private static lengthDictonary: Object =
    {
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

    private static heightDictonary: Object =
    {
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

    private static typeGroups: Object =
    {
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

    private static typeCategories: Object =
    {
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

    public static InitTypeHelper(selector: string = ".cnt-helpers-type"): void {
        // search if modal is present or not
        if (!$("#cnt-modal-type").length) {
            // load and inject it
            $.get("html/_cnt-modal.min.html").done((html) => {
                $("body").append(html);
            });
        }
        var groups = $(selector);
        $.each(groups,
            (index, item) => {
                var group = $(item);
                // find the helpblock 
                var helpBlock = group.next(".help-block");

                // find & set the input behavior
                var input = group.find("input.form-control");
                input.off("input change")
                    .on("input change", () => {
                        // get previous value
                        var value = input.val();
                        helpBlock.text(this.findLabel(value));
                    });

                // find & set the button
                var button = group.find(".btn");
                button.off("click")
                    .on("click", () => {
                        var modalWindow = $("#cnt-modal-type");
                        var settedValue = this.splitInput(input.val());
                        this.prepareModal(modalWindow, input, settedValue[0], settedValue[1], settedValue[2], settedValue[3]);
                        modalWindow.modal("show");
                    });
            });
    }

    private static findLabel(search: string): string {
        if (!search) return "Undefined Container Type";
        let code = search.charAt(0);
        let result = this.lengthDictonary[code] || "Unknow";
        if (search.length > 1) {
            code = search.charAt(1);
            result += ` [${this.heightDictonary[code] || "Unknow"}]`;
            if (search.length === 3) {
                code = search.charAt(2);
                result += ` - ${this.typeCategories[code] || "Unknow"}`;
            }
            if (search.length > 3) {
                code = search.substr(2, 2);
                result += ` - ${this.typeGroups[code] || "Unknow"}`;
            }
            if (search.length > 4) {
                result += "  *** Code is too long";
            }
        }
        return result;
    }

    private static splitInput(value: string): Array<string> {
        var result: Array<string> = new Array("2", "2", "G", "G0");
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
    }

    private static prepareModal(modal: JQuery, input: JQuery, selectedLenght: string, selectedheight: string, checkedType: string, checkedDetailType): void {
        var html = "";
        // setup lenghtDropdown
        this.setDropdown(this.lengthDictonary, selectedLenght, "#select-length", modal);

        // setup heightDropdown
        this.setDropdown(this.heightDictonary, selectedheight, "#select-height", modal);

        // setup type categories radiobutton
        for (let item in this.typeCategories) {
            let checked = item === checkedType ? "checked" : "";
            let active = checked ? "active" : "";
            html += this.format(this.typeCategoriesTemplate, item, this.typeCategories[item], checked, active);
        };
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
            .on("change",
            () => {
                // get the selected value
                var value = $("input[name=tc-radio]:checked").val();
                // re-construct the type details
                this.setTypeDetails(value, null, modal);
                this.setResult();
            });

        // for select button
        $("#cnt-modal-select-btn")
            .off("click")
            .on("click",
            () => {
                input.val(this.setResult());
                modal.modal("hide");
                input.trigger("change");
            });

    }

    private static setTypeDetails(checkedType: string, checkedDetailType: string, modal: JQuery): void {
        var html = "";
        // setup type details radiobutton
        var filteredGroup = Object.keys(this.typeGroups).filter((key) => {
            return key.indexOf(checkedType, 0) === 0;
        });

        filteredGroup.forEach((item) => {
            let checked = item === checkedDetailType ? "checked" : "";
            let active = checked ? "active" : "";
            html += this.format(this.typeTemplate, item, this.typeGroups[item], checked, active);
        });
        var group = modal.find("#type-RadioGroup");
        // and inject them
        group.html(html);

        // set behavior
        $("#type-RadioGroup")
            .off("change")
            .on("change",
            () => {
                this.setResult();
            });

    }

    private static setDropdown(dico: Object, selectedItem: string, element: string, modal: JQuery): void {
        var html = "";
        // setupdropdown
        for (let item in dico) {
            let selected = item === selectedItem ? "selected" : "";
            if (item.substr(0, 1) === "X") {
                html += this.format("<option disabled value>{0}</option>", dico[item]);
            } else {
                html += this.format("<option value='{0}' {2}>[{0}] - {1}</option>", item, dico[item], selected);
            }
        }
        var group = modal.find(element);
        // inject options
        group.html(html);

        // set behavior
        group.off("change")
            .on("change",
            () => {
                this.setResult();
            });
    }

    private static setResult(): string {
        var length = $("#select-length").val();
        var height = $("#select-height").val();
        var category = $("input[name=tc-radio]:checked").val();
        var detail = $("input[name=t-radio]:checked").val();
        var search = length + height + (detail ? detail : category);
        $("#cnt-result-label").text(this.findLabel(search));
        $("#cnt-result").text(search);
        return search;
    }

    private static format(formatted: string, ...data: string[]): string {
        for (let i = 0; i < data.length; i++) {
            var regexp = new RegExp("\\{" + i + "\\}", "gi");
            formatted = formatted.replace(regexp, data[i]);
        }
        return formatted;
    }

    private static typeCategoriesTemplate = "<label class='btn btn-default col-md-3 {3}'><input type='radio' name='tc-radio' value='{0}' autocomplete='off' {2}>{1}</label>";
    private static typeTemplate = "<div class='radio'><label><input type='radio' name='t-radio' value='{0}' {2}>{1}</label></div>";
}