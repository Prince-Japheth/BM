import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft2 } from 'iconsax-react-native';
import WhatsappButton from '../../components/WhatsappButton';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const JobItem = ({ name, location, gender }) => (
  <TouchableOpacity style={styles.jobItem}>
    <Image
      source={gender === 'male' ? require('../../assets/man.png') : require('../../assets/woman.png')}
      style={styles.avatar}
    />
    <View style={styles.jobInfo}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.location}>{location}</Text>
    </View>
  </TouchableOpacity>
);

const FeedbackItem = ({ id, feedback, rating, createdAt }) => (
  <View style={styles.feedbackItem}>
    <View style={styles.feedbackHeader}>
      <View style={styles.idContainer}>
        <Text style={styles.idText}>ID: {id}</Text>
        <View style={styles.ratingContainer}>
          {[...Array(rating)].map((_, index) => (
            <Text key={index} style={styles.star}>★</Text>
          ))}
          <Text style={styles.ratingText}>{rating}.0</Text>
        </View>
      </View>
      <Text style={styles.timestampText}>{new Date(createdAt).toLocaleDateString()}</Text>
    </View>
    <Text style={styles.feedbackText}>{feedback}</Text>
  </View>
);

export default function CompletedJobs() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('completed');
  const [completedJobs, setCompletedJobs] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const fetchCompletedJobs = async () => {
    try {
      const storedMerchantId = await AsyncStorage.getItem('merchantId');
      const token = await AsyncStorage.getItem('accessToken');

      if (!storedMerchantId || !token) {
        return;
      }

      const response = await api.get(`/merchants/${storedMerchantId}/securities/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          status: 'completed',
        },
      });

      if (response.status === 200) {
        setCompletedJobs(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setTimeout(fetchCompletedJobs, 5000);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    setLoadingFeedback(true);
    try {
      const storedMerchantId = await AsyncStorage.getItem('merchantId');
      const token = await AsyncStorage.getItem('accessToken');

      if (!storedMerchantId || !token) {
        return;
      }

      const response = await api.get(`/merchants/${storedMerchantId}/securities/user-feedbacks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: 1,
          limit: 10,
        },
      });

      if (response.status === 200) {
        setFeedbackData(response.data.data);
      }
    } catch (error) {
      console.error(error);
      setTimeout(fetchUserFeedbacks, 5000); // Corrected function name
    } finally {
      setLoadingFeedback(false);
    }
  };

  useEffect(() => {
    fetchCompletedJobs();
  }, []);

  useEffect(() => {
    if (activeTab === 'feedback') {
      fetchUserFeedbacks(); // Corrected function name
    }
  }, [activeTab]);


  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft2 size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('completed')}
        >
          {activeTab === 'completed' ? (
            <LinearGradient
              colors={['#AD52F7', '#CD8DFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTab}
            >
              <Text style={styles.activeTabText}>Completed Jobs</Text>
            </LinearGradient>
          ) : (
            <View style={styles.inactiveTab}>
              <Text style={styles.inactiveTabText}>Completed Jobs</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('feedback')}
        >
          {activeTab === 'feedback' ? (
            <LinearGradient
              colors={['#AD52F7', '#CD8DFE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientTab}
            >
              <Text style={styles.activeTabText}>User  Feedback</Text>
            </LinearGradient>
          ) : (
            <View style={styles.inactiveTab}>
              <Text style={styles.inactiveTabText}>User  Feedback</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {activeTab === 'completed' ? (
          loading ? (
            <ActivityIndicator size="large" color="#AD52F7" />
          ) : (
            completedJobs.map((job) => (
              <JobItem key={job.security_booking_id} name={job.client_first_name} location={job.pickup_location} gender={job.gender} />
            ))
          )
        ) : (
          loadingFeedback ? (
            <ActivityIndicator size="large" color="#AD52F7" />
          ) : (
            feedbackData.map((feedback) => (
              <FeedbackItem key={feedback.id} id={feedback.id} feedback={feedback.feedback} rating={feedback.rating} createdAt={feedback.createdAt} />
            ))
          )
        )}
      </ScrollView>

      <WhatsappButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientTab: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  inactiveTab: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#666',
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  jobItem: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  feedbackItem: {
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  idContainer: {
    flexDirection: 'column',
  },
  idText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#FFD700',
    fontSize: 20,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  feedbackText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  jobInfo: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
});