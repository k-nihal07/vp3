import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { EcoIsland } from './src/components/3d/EcoIsland';
import { useCarbonStore } from './src/stores/useCarbonStore';

export default function App() {
  const healthIndex = useCarbonStore((state) => state.healthIndex);
  const ecoCredits = useCarbonStore((state) => state.ecoCredits);
  const treeCount = useCarbonStore((state) => state.treeCount);
  const factoryCount = useCarbonStore((state) => state.factoryCount);
  const windmillCount = useCarbonStore((state) => state.windmillCount);
  const creatures = useCarbonStore((state) => state.creatures);
  const companionState = useCarbonStore((state) => state.companionState);

  const earnCredits = useCarbonStore((state) => state.earnCredits);
  const buyItem = useCarbonStore((state) => state.buyItem);
  const buildFactory = useCarbonStore((state) => state.buildFactory);
  const triggerDeforestation = useCarbonStore((state) => state.triggerDeforestation);

  const [shopVisible, setShopVisible] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState("System initialized. Log carbon-reduction deeds to generate credits for biome construction.");
  const [lastDeed, setLastDeed] = useState("");

  const ecoDeeds = [
    { text: "Commuted 6km using zero-emission bicycle transit", reward: 12 },
    { text: "Diverted household organic waste to compost storage", reward: 8 },
    { text: "Installed high-efficiency solar-powered LED modules", reward: 15 },
    { text: "Separated post-consumer recyclable plastics and paper", reward: 10 },
    { text: "Opted out of single-use shipping packaging", reward: 6 },
    { text: "Retrofitted storm-water collection system for garden irrigation", reward: 18 },
  ];

  const co2Rate = (factoryCount * 2.5) - (treeCount * 0.4) - (windmillCount * 0.8);
  const faunaPopulation = creatures.birds + creatures.butterflies + creatures.sheep;
  const cleanGridLoad = windmillCount > 0 
    ? Math.min(100, Math.round((windmillCount / Math.max(1, factoryCount)) * 100))
    : 0;

  const handleEcoDeed = () => {
    const randomDeed = ecoDeeds[Math.floor(Math.random() * ecoDeeds.length)]!;
    earnCredits(randomDeed.reward);
    setLastDeed(`Logged: "${randomDeed.text}" (+${randomDeed.reward} Cr)`);
    
    if (healthIndex > 0.8) {
      setBuddyMessage("Telemetry reports optimal air quality. Biome core is stable.");
    } else {
      setBuddyMessage("Carbon emission rate is high. Allocating credits to clean energy turbines is recommended.");
    }
  };

  const handleBuddyTap = () => {
    if (companionState === 'coughing') {
      setBuddyMessage("Alert: Suspended particulate matters are elevated. Factory emissions are polluting this sector. Deploy Wind Turbines.");
    } else if (companionState === 'happy') {
      setBuddyMessage("Biome status: Optimal. Atmosphere is clean. Unlocking biodiversity options.");
    } else if (companionState === 'sad') {
      setBuddyMessage("Warning: Flora index depleted. Soil degradation detected. Plant pine trees to restore core health.");
    } else {
      setBuddyMessage("EcoBuddy mannequin responder active. Standby for target installation options.");
    }
  };

  const attemptPurchase = (type: 'tree' | 'windmill' | 'bird' | 'butterfly' | 'sheep', cost: number) => {
    const success = buyItem(type, cost);
    if (success) {
      setBuddyMessage(`Acquisition confirmed: ${type} module added to biome grid.`);
    } else {
      setBuddyMessage("Transaction failed. Insufficient environmental credits.");
    }
  };

  const getHealthBarColor = () => {
    if (healthIndex > 0.7) return '#10b981'; // Emerald Green
    if (healthIndex > 0.4) return '#f59e0b'; // Amber Gold
    return '#f43f5e'; // Deep Crimson Rose
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 3D Simulation Canvas */}
      <Canvas style={styles.canvas} camera={{ position: [0, 2.6, 4.6], fov: 55 }} shadows>
        <ambientLight intensity={0.35} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={1.3} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <pointLight position={[-5, 4, -5]} intensity={0.4} />
        <EcoIsland />
      </Canvas>

      {/* SAAS METRIC OVERLAY / HUD */}
      
      {/* 1. Header Metrics Card */}
      <View style={styles.header}>
        <View style={styles.statRow}>
          <View>
            <Text style={styles.subTitle}>TELEMETRY HUB</Text>
            <Text style={styles.title}>ECOSYSTEM CONTROL</Text>
          </View>
          <View style={styles.creditPill}>
            <Text style={styles.creditLabel}>CREDIT WALLET</Text>
            <Text style={styles.creditText}>{ecoCredits} Cr</Text>
          </View>
        </View>

        {/* Health Progress bar */}
        <View style={styles.healthContainer}>
          <View style={styles.healthLabels}>
            <Text style={styles.healthLabel}>GRID ENVIRONMENTAL INTEGRITY</Text>
            <Text style={[styles.healthVal, { color: getHealthBarColor() }]}>{(healthIndex * 100).toFixed(0)}%</Text>
          </View>
          <View style={styles.healthBarBg}>
            <View style={[styles.healthBarFill, { width: `${healthIndex * 100}%`, backgroundColor: getHealthBarColor() }]} />
          </View>
        </View>
      </View>

      {/* 2. Interactive Dialog Panel */}
      <View style={styles.buddyBubbleContainer}>
        <TouchableOpacity style={styles.buddyBubble} onPress={handleBuddyTap}>
          <View style={styles.buddyHeader}>
            <Text style={styles.buddyTitle}>BIOME COMPANION FEED</Text>
            <Text style={styles.tapPrompt}>CLICK AVATAR TO QUERY</Text>
          </View>
          <Text style={styles.buddySpeech}>{buddyMessage}</Text>
        </TouchableOpacity>
        {lastDeed ? <Text style={styles.deedToast}>{lastDeed}</Text> : null}
      </View>

      {/* 3. Live Telemetry Console (Mid-Right) */}
      <View style={styles.statsPanel}>
        <Text style={styles.panelTitle}>SATELLITE DATA</Text>
        
        <View style={styles.panelMetric}>
          <Text style={styles.metricLabel}>net co2 flux</Text>
          <Text style={[styles.metricValue, co2Rate > 0 ? styles.redText : styles.greenText]}>
            {co2Rate > 0 ? `+${co2Rate.toFixed(2)}` : co2Rate.toFixed(2)} kg/h
          </Text>
        </View>
        
        <View style={styles.panelMetric}>
          <Text style={styles.metricLabel}>biodiversity</Text>
          <Text style={styles.metricValue}>{faunaPopulation} units</Text>
        </View>
        
        <View style={styles.panelMetric}>
          <Text style={styles.metricLabel}>clean power ratio</Text>
          <Text style={styles.metricValue}>{cleanGridLoad}%</Text>
        </View>
      </View>

      {/* 4. Sleek Dashboard Action Panel */}
      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.deedButton} onPress={handleEcoDeed}>
          <Text style={styles.deedButtonText}>LOG CARBON REDUCTION ACTIVITY</Text>
        </TouchableOpacity>

        <View style={styles.sandboxActions}>
          <TouchableOpacity style={[styles.actionBtn, styles.polluteBtn]} onPress={buildFactory}>
            <Text style={styles.actionBtnText}>CONSTRUCT REFINERY Hall</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionBtn, styles.deforestBtn]} onPress={triggerDeforestation}>
            <Text style={styles.actionBtnText}>EXECUTE DEFORESTATION</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.shopTrigger} onPress={() => setShopVisible(true)}>
          <Text style={styles.shopTriggerText}>OPEN ACQUISITIONS CATALOG</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Sleek Corporate Modal Catalog */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={shopVisible}
        onRequestClose={() => setShopVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSub}>ASSET INVENTORY</Text>
                <Text style={styles.modalTitle}>Acquisitions Shop</Text>
              </View>
              <View style={styles.modalWalletBox}>
                <Text style={styles.modalWalletLabel}>WALLET BALANCE</Text>
                <Text style={styles.modalWallet}>{ecoCredits} Credits</Text>
              </View>
            </View>

            <ScrollView style={styles.shopItemsList}>
              {/* Item: Tree */}
              <View style={styles.shopItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Pine Tree Module</Text>
                  <Text style={styles.itemDesc}>Offsets localized emissions. Restores health +8%.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyBtn, ecoCredits < 10 && styles.buyBtnDisabled]} 
                  onPress={() => attemptPurchase('tree', 10)}
                >
                  <Text style={[styles.buyBtnText, ecoCredits < 10 && styles.buyBtnTextDisabled]}>10 Cr</Text>
                </TouchableOpacity>
              </View>

              {/* Item: Windmill */}
              <View style={styles.shopItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Clean Wind Turbine</Text>
                  <Text style={styles.itemDesc}>Supplies zero-emission power grid. Restores health +12%.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyBtn, ecoCredits < 30 && styles.buyBtnDisabled]} 
                  onPress={() => attemptPurchase('windmill', 30)}
                >
                  <Text style={[styles.buyBtnText, ecoCredits < 30 && styles.buyBtnTextDisabled]}>30 Cr</Text>
                </TouchableOpacity>
              </View>

              {/* Item: Butterfly */}
              <View style={styles.shopItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Fauna: Butterflies</Text>
                  <Text style={styles.itemDesc}>Adds ambient fluttery butterflies. Adds health +2%.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyBtn, ecoCredits < 50 && styles.buyBtnDisabled]} 
                  onPress={() => attemptPurchase('butterfly', 50)}
                >
                  <Text style={[styles.buyBtnText, ecoCredits < 50 && styles.buyBtnTextDisabled]}>50 Cr</Text>
                </TouchableOpacity>
              </View>

              {/* Item: Bird */}
              <View style={styles.shopItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Fauna: Sky Birds</Text>
                  <Text style={styles.itemDesc}>Spawns circling flying birds. Adds health +2%.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyBtn, ecoCredits < 50 && styles.buyBtnDisabled]} 
                  onPress={() => attemptPurchase('bird', 50)}
                >
                  <Text style={[styles.buyBtnText, ecoCredits < 50 && styles.buyBtnTextDisabled]}>50 Cr</Text>
                </TouchableOpacity>
              </View>

              {/* Item: Sheep */}
              <View style={styles.shopItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>Fauna: Grazing Sheep</Text>
                  <Text style={styles.itemDesc}>Spawns grazing sheep on terrain. Adds health +2%.</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.buyBtn, ecoCredits < 50 && styles.buyBtnDisabled]} 
                  onPress={() => attemptPurchase('sheep', 50)}
                >
                  <Text style={[styles.buyBtnText, ecoCredits < 50 && styles.buyBtnTextDisabled]}>50 Cr</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Inventory Overview */}
            <View style={styles.inventoryView}>
              <Text style={styles.invTitle}>GRID INSTALLED GRID SUMMARY</Text>
              <Text style={styles.invStats}>
                Pine Trees: {treeCount} | Wind Turbines: {windmillCount} | Industrial Plants: {factoryCount}
              </Text>
              <Text style={styles.invStats}>
                Fauna: {faunaPopulation} (Butterflies: {creatures.butterflies} | Birds: {creatures.birds} | Sheep: {creatures.sheep})
              </Text>
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShopVisible(false)}>
              <Text style={styles.closeBtnText}>RETURN TO GRAPH CONSOLE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b', // Deep carbon black
  },
  canvas: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(15, 15, 18, 0.9)',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#27272a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  subTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#71717a',
    letterSpacing: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fafafa',
    letterSpacing: 0.5,
  },
  creditPill: {
    backgroundColor: '#18181b',
    borderWidth: 1.5,
    borderColor: '#e4e4e7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
    alignItems: 'flex-end',
  },
  creditLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#a1a1aa',
    letterSpacing: 1,
    marginBottom: 2,
  },
  creditText: {
    fontWeight: 'bold',
    color: '#fafafa',
    fontSize: 14,
  },
  healthContainer: {
    marginTop: 2,
  },
  healthLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 6,
  },
  healthLabel: {
    color: '#71717a',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  healthVal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  healthBarBg: {
    height: 6,
    backgroundColor: '#27272a',
    borderRadius: 2,
    overflow: 'hidden',
  },
  healthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  buddyBubbleContainer: {
    position: 'absolute',
    top: 195,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  buddyBubble: {
    backgroundColor: 'rgba(15, 15, 18, 0.95)',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#27272a',
    width: '100%',
  },
  buddyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  buddyTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#38bdf8',
    letterSpacing: 1.5,
  },
  tapPrompt: {
    fontSize: 7,
    color: '#71717a',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  buddySpeech: {
    fontSize: 13,
    color: '#e4e4e7',
    lineHeight: 18,
    fontWeight: '500',
  },
  deedToast: {
    marginTop: 8,
    color: '#34d399',
    fontSize: 11,
    fontWeight: 'bold',
    backgroundColor: 'rgba(9, 67, 49, 0.4)',
    borderWidth: 1.5,
    borderColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  // Telemetry details panel
  statsPanel: {
    position: 'absolute',
    top: 320,
    right: 20,
    backgroundColor: 'rgba(15, 15, 18, 0.9)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#27272a',
    width: 140,
    gap: 8,
  },
  panelTitle: {
    fontSize: 8,
    fontWeight: '900',
    color: '#71717a',
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 4,
    marginBottom: 2,
  },
  panelMetric: {
    flexDirection: 'column',
  },
  metricLabel: {
    fontSize: 7,
    color: '#52525b',
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f4f4f5',
  },
  greenText: {
    color: '#10b981',
  },
  redText: {
    color: '#f43f5e',
  },
  // Sleek buttons
  bottomControls: {
    position: 'absolute',
    bottom: 35,
    left: 20,
    right: 20,
    gap: 10,
  },
  deedButton: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  deedButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sandboxActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  polluteBtn: {
    backgroundColor: '#27272a',
    borderColor: '#3f3f46',
  },
  deforestBtn: {
    backgroundColor: '#451a03',
    borderColor: '#7c2d12',
  },
  actionBtnText: {
    color: '#fafafa',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  shopTrigger: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  shopTriggerText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  // Shop catalog styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#18181b',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#27272a',
    maxHeight: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
    borderBottomWidth: 1.5,
    borderBottomColor: '#27272a',
    paddingBottom: 12,
  },
  modalSub: {
    fontSize: 8,
    fontWeight: '800',
    color: '#71717a',
    letterSpacing: 2,
    marginBottom: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
  },
  modalWalletBox: {
    backgroundColor: '#18181b',
    borderWidth: 1.5,
    borderColor: '#27272a',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
  modalWalletLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#71717a',
    letterSpacing: 1,
  },
  modalWallet: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  shopItemsList: {
    marginBottom: 16,
  },
  shopItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#18181b',
    padding: 14,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#27272a',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 3,
  },
  itemDesc: {
    fontSize: 11,
    color: '#71717a',
    lineHeight: 14,
  },
  buyBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e4e4e7',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  buyBtnDisabled: {
    backgroundColor: '#18181b',
    borderColor: '#27272a',
  },
  buyBtnText: {
    color: '#09090b',
    fontWeight: '800',
    fontSize: 12,
  },
  buyBtnTextDisabled: {
    color: '#3f3f46',
  },
  inventoryView: {
    backgroundColor: '#09090b',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#27272a',
  },
  invTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#52525b',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  invStats: {
    fontSize: 11,
    color: '#a1a1aa',
    lineHeight: 18,
    fontWeight: '500',
  },
  closeBtn: {
    backgroundColor: '#27272a',
    borderWidth: 1.5,
    borderColor: '#3f3f46',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1.5,
  },
});
