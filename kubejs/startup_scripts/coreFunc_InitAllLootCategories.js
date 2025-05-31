// priority: 199
// type: startup

if (ApotheosisRegister) {
    ApotheosisRegister.InitAllLootCategories = function() {
        if (true) {
            func_InitExamples()
        }
        if (Platform.isLoaded("curios")) {
            func_InitCuriosLootCategories()
        }
        if (Platform.isLoaded("irons_spellbooks")) {
            func_InitIronsLootCategories()
        }
        ApotheosisRegister.InitAllLootCategories = null
    }
} else {
    console.error(`ApotheosisRegister is not loaded`);
}
