// priority: 200
// type: startup

const ApotheosisRegister = (function() {
    // Initial part head
    // -------------------------------------------------------------------------------------------------------------------------
    let apotheosisClass
    try {
        apotheosisClass = global.apotheosisClass = {
            LootCategory: Java.loadClass('dev.shadowsoffire.apotheosis.loot.LootCategory'),
            EntitySlotGroup: Java.loadClass('dev.shadowsoffire.apothic_attributes.modifiers.EntitySlotGroup'),
            EntityEquipmentSlot: Java.loadClass('dev.shadowsoffire.apothic_attributes.modifiers.EntityEquipmentSlot'),
            DeferredHelper: Java.loadClass('dev.shadowsoffire.placebo.registry.DeferredHelper'),
            Apoth$BuiltInRegs: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth$BuiltInRegs'),
            ALObjects$BuiltInRegs: Java.loadClass('dev.shadowsoffire.apothic_attributes.api.ALObjects$BuiltInRegs'),
            CurioEquipmentSlot: Java.loadClass('dev.shadowsoffire.apothic_attributes.compat.CurioEquipmentSlot'),
            Apoth: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth'),
            Apoth$LootCategories: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth$LootCategories'),
            Apoth$DataMaps: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth$DataMaps'),
            ApothicAttributes: Java.loadClass('dev.shadowsoffire.apothic_attributes.ApothicAttributes'),
            ALObjects$EquipmentSlotGroups: Java.loadClass('dev.shadowsoffire.apothic_attributes.api.ALObjects$EquipmentSlotGroups'),
            Components: Java.loadClass('dev.shadowsoffire.apotheosis.Apoth$Components'),
            ItemAffixes: Java.loadClass('dev.shadowsoffire.apotheosis.affix.ItemAffixes'),
            AffixInstance: Java.loadClass('dev.shadowsoffire.apotheosis.affix.AffixInstance'),
            GenContext: Java.loadClass('dev.shadowsoffire.apotheosis.tiers.GenContext'),
            WorldTier: Java.loadClass('dev.shadowsoffire.apotheosis.tiers.WorldTier'),
            AffixHelper: Java.loadClass('dev.shadowsoffire.apotheosis.affix.AffixHelper'),
            AffixDefinition: Java.loadClass('dev.shadowsoffire.apotheosis.affix.AffixDefinition'),
            AffixType: Java.loadClass('dev.shadowsoffire.apotheosis.affix.AffixType'),
            AffixRegistry: Java.loadClass('dev.shadowsoffire.apotheosis.affix.AffixRegistry'),
            Affix: Java.loadClass('dev.shadowsoffire.apotheosis.affix.Affix'),
            LootController: Java.loadClass('dev.shadowsoffire.apotheosis.loot.LootController')
        }
    } catch (error) {
        console.error(`apotheosis class loading error: ${error}`);
    }


    let neededClass
    try {
        neededClass = global.neededClass = {
            Random: Java.loadClass('java.util.Random'),
            Style: Java.loadClass('net.minecraft.network.chat.Style'),
            Component: Java.loadClass('net.minecraft.network.chat.Component'),
            TagKey: Java.loadClass('net.minecraft.tags.TagKey'),
            ItemStack: Java.loadClass('net.minecraft.world.item.ItemStack'),
            HolderSet: Java.loadClass('net.minecraft.core.HolderSet'),
            KubeJS: Java.loadClass('dev.latvian.mods.kubejs.KubeJS'),
            Registries: Java.loadClass('net.minecraft.core.registries.Registries'),
            Predicates: Java.loadClass('com.google.common.base.Predicates'),
            DataComponents: Java.loadClass('net.minecraft.core.component.DataComponents'),
            ItemAttributeModifiers: Java.loadClass('net.minecraft.world.item.component.ItemAttributeModifiers'),
            EquipmentSlot: Java.loadClass('net.minecraft.world.entity.EquipmentSlot'),
            Pattern: Java.loadClass(`java.util.regex.Pattern`),
            Matcher: Java.loadClass(`java.util.regex.Matcher`),
            BuiltInRegistries: Java.loadClass('net.minecraft.core.registries.BuiltInRegistries'),
            ResourceLocation: Java.loadClass('net.minecraft.resources.ResourceLocation')
        }
    } catch (error) {
        console.error(`common class loading error: ${error}`);
    }

    let ironsClass
    try {
        ironsClass = global.ironsClass = {
            CastingItem: Java.loadClass('io.redspace.ironsspellbooks.item.CastingItem'),
            SpellBook: Java.loadClass('io.redspace.ironsspellbooks.item.SpellBook'),
            SchoolRegistry: Java.loadClass('io.redspace.ironsspellbooks.api.registry.SchoolRegistry'),
            CurioBaseItem: Java.loadClass('io.redspace.ironsspellbooks.item.curios.CurioBaseItem')
        }
    } catch (error) {
        console.error(`irons_spellbooks class loading error: ${error}`);
    }

    let curiosClass
    try {
        curiosClass = global.curiosClass = {
            CuriosRegistry: Java.loadClass('top.theillusivec4.curios.common.CuriosRegistry'),
            CurioAttributeModifiers: Java.loadClass('top.theillusivec4.curios.api.CurioAttributeModifiers'),
            SlotContext: Java.loadClass('top.theillusivec4.curios.api.SlotContext'),
            CuriosImplMixinHooks: Java.loadClass('top.theillusivec4.curios.mixin.CuriosImplMixinHooks')
        }
    } catch (error) {
        console.error(`irons_spellbooks class loading error: ${error}`);
    }

    const ApotheosisRegister = {}

    try {
        let $R
        ApotheosisRegister.registerNamespace = function(namespace) {
            $R = global.apotheosisClass.DeferredHelper.create(namespace)
            return $R
        }
        
        ApotheosisRegister.registerCurioSlot = function(slot) {
            return $R['custom(java.lang.String,net.minecraft.resources.ResourceKey,java.util.function.Supplier)'](
                slot, 
                apotheosisClass.ALObjects$BuiltInRegs.ENTITY_EQUIPMENT_SLOT.key(), 
                () => new apotheosisClass.CurioEquipmentSlot(slot)
            );
        }

        ApotheosisRegister.registSlotGroup = function(path, slots) {
            return $R['custom(java.lang.String,net.minecraft.resources.ResourceKey,java.lang.Object)'](
                path, 
                apotheosisClass.ALObjects$BuiltInRegs.ENTITY_SLOT_GROUP.key(), 
                new apotheosisClass.EntitySlotGroup(neededClass.ResourceLocation.fromNamespaceAndPath($KEY, path), neededClass.HolderSet['direct(net.minecraft.core.Holder[])'](slots))
            );
        }

        ApotheosisRegister.registerLootCategory = function(path, group, validator, priority) {
            if (!priority) {
                return $R['custom(java.lang.String,net.minecraft.resources.ResourceKey,java.lang.Object)'](
                    path, 
                    apotheosisClass.Apoth$BuiltInRegs.LOOT_CATEGORY.key(), 
                    new apotheosisClass.LootCategory(validator, group, 1000)
                );
            }
            return $R['custom(java.lang.String,net.minecraft.resources.ResourceKey,java.lang.Object)'](
                path, 
                apotheosisClass.Apoth$BuiltInRegs.LOOT_CATEGORY.key(), 
                new apotheosisClass.LootCategory(validator, group, priority)
            );
        }

        ApotheosisRegister.registerLootCategoryOrFlase = function(path, group, flag, validator) {
            if (validator && flag) {
                return ApotheosisRegister.registerLootCategory(path, group, validator)
            } else {
                return ApotheosisRegister.registerLootCategory(path, group, neededClass.Predicates.alwaysFalse())
            };
        }
    } catch (error) {
        console.error(`ApotheosisRegister loading error: ${error}`);
    }
    // ------------------------------------------------------------------------------------------------------------------------
    // Initial part tail
    return ApotheosisRegister
})()