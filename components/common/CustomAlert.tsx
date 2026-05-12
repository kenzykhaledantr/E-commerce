// src/components/common/CustomAlert.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useTheme } from '../../hook/useTheme';
import { SPACING, RADIUS } from '../../utils/constants';

const { width } = Dimensions.get('window');

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertButton {
  text:    string;
  onPress?: () => void;
  style?:  'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
  visible:   boolean;
  type?:     AlertType;
  title:     string;
  message:   string;
  buttons?:  AlertButton[];
  onClose:   () => void;
}

type AlertConfig = {
  icon:       string;
  iconBg:     string;
  iconColor:  string;
  titleColor: string;
};

const ALERT_CONFIG: { [key in AlertType]: AlertConfig } = {
  error: {
    icon:       '!',
    iconBg:     '#FEE2E2',
    iconColor:  '#DC2626',
    titleColor: '#DC2626',
  },
  success: {
    icon:       '✓',
    iconBg:     '#DCFCE7',
    iconColor:  '#16A34A',
    titleColor: '#16A34A',
  },
  warning: {
    icon:       '!',
    iconBg:     '#FEF9C3',
    iconColor:  '#CA8A04',
    titleColor: '#CA8A04',
  },
  info: {
    icon:       'i',
    iconBg:     '#DBEAFE',
    iconColor:  '#2563EB',
    titleColor: '#2563EB',
  },
};

export default function CustomAlert({
  visible,
  type    = 'error',
  title,
  message,
  buttons = [{ text: 'OK' }],
  onClose,
}: CustomAlertProps) {
  const { colors: C } = useTheme();
  const scale         = useRef(new Animated.Value(0.85)).current;
  const opacity       = useRef(new Animated.Value(0)).current;
  const cfg           = ALERT_CONFIG[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scale, {
          toValue:     1,
          useNativeDriver: true,
          speed:       20,
          bounciness:  8,
        }),
        Animated.timing(opacity, {
          toValue:  1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue:  0.85,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue:  0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleButton = (btn: AlertButton) => {
    onClose();
    btn.onPress?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Alert card */}
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: C.surface,
              transform:       [{ scale }],
            },
          ]}
        >
          {/* Icon circle */}
          <View style={[styles.iconCircle, { backgroundColor: cfg.iconBg }]}>
            <Text style={[styles.iconText, { color: cfg.iconColor }]}>
              {cfg.icon}
            </Text>
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: cfg.titleColor }]}>
            {title}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: C.textSecondary }]}>
            {message}
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: C.border }]} />

          {/* Buttons */}
          <View style={[
            styles.buttonsRow,
            buttons.length === 1 && styles.singleButton,
          ]}>
            {buttons.map((btn, i) => (
              <React.Fragment key={btn.text}>
                {/* Vertical divider between buttons */}
                {i > 0 && (
                  <View style={[styles.btnDivider, { backgroundColor: C.border }]} />
                )}
                <TouchableOpacity
                  style={[
                    styles.btn,
                    buttons.length === 1 && styles.btnFull,
                  ]}
                  onPress={() => handleButton(btn)}
                  activeOpacity={0.6}
                >
                  <Text style={[
                    styles.btnText,
                    {
                      color:
                        btn.style === 'destructive' ? '#DC2626' :
                        btn.style === 'cancel'      ? C.textSecondary :
                        cfg.iconColor,
                    },
                    btn.style !== 'cancel' && styles.btnTextBold,
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    width:        width - SPACING.xl * 2,
    borderRadius: RADIUS.xl,
    alignItems:   'center',
    paddingTop:   SPACING.xl,
    overflow:     'hidden',
    shadowColor:  '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation:    12,
  },
  iconCircle: {
    width:          56,
    height:         56,
    borderRadius:   28,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   SPACING.md,
  },
  iconText: {
    fontSize:   26,
    fontWeight: '700',
    lineHeight: 30,
  },
  title: {
    fontSize:      17,
    fontWeight:    '700',
    textAlign:     'center',
    marginBottom:  SPACING.xs,
    paddingHorizontal: SPACING.lg,
  },
  message: {
    fontSize:      14,
    textAlign:     'center',
    lineHeight:    22,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  divider: {
    width:  '100%',
    height: 0.5,
  },
  buttonsRow: {
    flexDirection: 'row',
    width:         '100%',
    minHeight:     50,
  },
  singleButton: {
    justifyContent: 'center',
  },
  btn: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
  },
  btnFull: { flex: 1 },
  btnDivider: {
    width: 0.5,
    alignSelf: 'stretch',
  },
  btnText:     { fontSize: 15, textAlign: 'center' },
  btnTextBold: { fontWeight: '700' },
});