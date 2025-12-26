/**
 * WelcomeScreen Component
 * First screen where user enters a topic
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Button, Input, Card } from '../components/ui';
import { colors, typography, spacing, borderRadius } from '../styles';
import { useAppContext } from '../context';
import { ACTION_TYPES } from '../context/actions';
import { geminiService } from '../services';
import { SAMPLE_TOPICS } from '../utils/constants';

export const WelcomeScreen = () => {
  const { dispatch } = useAppContext();
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async () => {
    if (!topic.trim()) {
      setError('Lütfen bir konu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Set the topic
      dispatch({ type: ACTION_TYPES.SET_TOPIC, payload: topic.trim() });

      // Generate cards
      const cards = await geminiService.generateCards(topic.trim(), 1);
      
      // Start round with generated cards
      dispatch({ type: ACTION_TYPES.START_ROUND, payload: cards });
    } catch (err) {
      console.error('Error starting:', err);
      setError('Bir hata oluştu. Tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
    if (error) setError('');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>
        {/* Logo / Illustration */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🎓</Text>
          </View>
          <Text style={styles.title}>Ne Öğrenmek İstiyorsun?</Text>
          <Text style={styles.subtitle}>
            Bir konu gir ve interaktif kartlarla öğrenmeye başla!
          </Text>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Input
            placeholder="Örn: Hayvanlar, Yemekler, Renkler..."
            value={topic}
            onChangeText={(text) => {
              setTopic(text);
              if (error) setError('');
            }}
            error={error}
            style={styles.input}
          />

          {/* Sample Topics */}
          <Text style={styles.sampleLabel}>Popüler Konular</Text>
          <View style={styles.topicsContainer}>
            {SAMPLE_TOPICS.map((sampleTopic, index) => (
              <Pressable
                key={index}
                onPress={() => handleTopicSelect(sampleTopic)}
                style={({ pressed }) => [
                  styles.topicChip,
                  topic === sampleTopic && styles.topicChipActive,
                  pressed && styles.topicChipPressed,
                ]}
              >
                <Text style={[
                  styles.topicText,
                  topic === sampleTopic && styles.topicTextActive,
                ]}>
                  {sampleTopic}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Start Button */}
          <Button
            title={loading ? 'Kartlar Hazırlanıyor...' : 'Başla 🚀'}
            onPress={handleStart}
            disabled={loading || !topic.trim()}
            loading={loading}
            fullWidth
            size="lg"
            style={styles.startButton}
          />

          <Text style={styles.infoText}>
            💡 Tek seferlik giriş yap, sonra sadece tıkla!
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <FeatureItem emoji="🃏" text="5 Kart ile Öğren" />
          <FeatureItem emoji="🔍" text="Yanlışı Bul" />
          <FeatureItem emoji="✍️" text="Açıkla ve Öğren" />
          <FeatureItem emoji="🎯" text="Doğruyu Seç" />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Gemini AI ✨</Text>
      </View>
    </ScrollView>
  );
};

const FeatureItem = ({ emoji, text }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>{emoji}</Text>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl * 2,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 56,
  },
  title: {
    ...typography.h1,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  inputSection: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  input: {
    width: '100%',
  },
  sampleLabel: {
    ...typography.caption,
    color: colors.text.muted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  topicChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surface.primary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  topicChipActive: {
    backgroundColor: colors.primary.light,
    borderColor: colors.primary.main,
  },
  topicChipPressed: {
    opacity: 0.7,
  },
  topicText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  topicTextActive: {
    color: colors.primary.dark,
    fontWeight: '600',
  },
  startButton: {
    width: '100%',
    marginTop: spacing.md,
  },
  infoText: {
    ...typography.caption,
    color: colors.text.muted,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: spacing.xl * 2,
    gap: spacing.md,
  },
  featureItem: {
    alignItems: 'center',
    padding: spacing.sm,
    minWidth: 80,
  },
  featureEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  featureText: {
    ...typography.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  footer: {
    padding: spacing.md,
    alignItems: 'center',
  },
  footerText: {
    ...typography.caption,
    color: colors.text.muted,
  },
});

export default WelcomeScreen;
