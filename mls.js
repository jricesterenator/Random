var PREFS;
var PREFS_KEY = "housePrefs";
var CSS_READ = "pref_read";
var CSS_FAVE = "pref_fave";
var CSS_DELETED = "pref_deleted";
var CSS_TOURED = "pref_toured";

var FAVE_COLOR = "gold";

var FAVE_PREF = {
    prefKey: 'fave',
    cssClass: CSS_FAVE
};
var READ_PREF = {
    prefKey: 'read',
    cssClass: CSS_READ
};
var DELETED_PREF = {
    prefKey: 'deleted',
    cssClass: CSS_DELETED
};
var TOURED_PREF = {
    prefKey: 'toured',
    cssClass: CSS_TOURED
};

function loadPrefs() {
    var prefsString = GM_getValue(PREFS_KEY, "{}");
    var prefs = JSON.parse(prefsString);

    if(!prefs) {
        GM_log('Error! JSON.parse failed - The stored value for "housePrefs" is likely to be corrupted.');
    }
    if(!prefs.mls) {
        prefs.mls = {};
    }
    GM_log("Loaded house prefs:");
    GM_log(prefs);

    PREFS = prefs;
}

function savePref(type, mlsid, keep) {

    if(!keep && PREFS.mls[mlsid] && PREFS.mls[mlsid][type]) {
        delete PREFS.mls[mlsid][type];
    } else {
        if(!PREFS.mls[mlsid]) {
            PREFS.mls[mlsid] = {};
        }
        PREFS.mls[mlsid][type] = true;
    }
    GM_setValue(PREFS_KEY, JSON.stringify(PREFS));
    GM_log("Updated prefs:");
    GM_log(PREFS);

}

function getPrefsEntry(mlsid) {
    var res = PREFS.mls[mlsid];
    if(res === undefined) {
        return {};
    }
    return res;
}

//###########################################
// The CSS styles
//###########################################
//Styles for when a property is marked Read
GM_addStyle("." + CSS_READ + " { \
				color: lightgray; \
            }");
GM_addStyle("." + CSS_READ + " a:link { \
				color: lightgray; \
            }");
GM_addStyle("." + CSS_READ + " img { \
			    opacity: 0.4; \
			    filter: alpha(opacity=40); /* msie */ \
            }");

//Styles for when a property is deleted
GM_addStyle("." + CSS_DELETED + " .IDX-cellInnerWrapper { \
				display:none; \
            }");

//Styles for fave properties
GM_addStyle("." + CSS_FAVE + " { \
				background-color:" + FAVE_COLOR + "; \
            }");

//Styles for toured properties
GM_addStyle("." + CSS_TOURED + " .tourInfo  { \
				display:inline; \
            }");
GM_addStyle(".tourInfo { \
				display:none; \
				color:darkgreen; \
				font-weight:bold; \
				border:1px solid darkgreen; \
				padding: 3px; \
            }");

//###########################################
// Loading
//###########################################
function initHouseHunter() {
    GM_log("Loading house helper.");
    loadPrefs();

    //###########################################
    // Common event bindings
    //###########################################
    $(".markLike").on('click', function(event) {
        applySetting(event, FAVE_PREF);
    });

    $(".markToured").on('click', function(event) {
        applySetting(event, TOURED_PREF);
    });

    $(".markRead").on('click', function(event) {
        applySetting(event, READ_PREF);
    });

    $(".markDeleted").on('click', function(event) {
        applySetting(event, DELETED_PREF);
    });

}
//###########################################
