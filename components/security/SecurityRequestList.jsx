// C:\Users\USER\Documents\bondyt-merchant-app\components\security\SecurityRequestList.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TickCircle, CloseCircle } from 'iconsax-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiService';

export const SecurityRequestList = ({
  showRequest,
  securityRequests,
  filteredRequests,
  counts,
  assignedFilter,
  setAssignedFilter,
  handleViewRequest,
  handleViewAssignedRequest,
  onRefresh,
}) => {
  const [updatingRequestId, setUpdatingRequestId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStatusUpdate = async (request) => {
    if (updatingRequestId || isRefreshing) return;

    try {
      setUpdatingRequestId(request.date_booking_id);
      setIsRefreshing(true);

      const merchantId = await AsyncStorage.getItem('merchantId');
      const token = await AsyncStorage.getItem('accessToken');

      if (!merchantId || !token) {
        throw new Error('Missing required authentication data');
      }

      const response = await api.put(
        `/merchants/${merchantId}/securities/bookings`,
        {
          officers_ids: request.officers_ids || [],
          security_booking_id: request.security_booking_id,
          date_booking_id: request.date_booking_id,
          status: "completed"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        if (onRefresh) {
          await onRefresh();
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update request status'
      );
    } finally {
      setUpdatingRequestId(null);
      setIsRefreshing(false);
    }
  };

  const handleRequestPress = (request) => {
    if (request.request_status === 'unassigned') {
      handleViewRequest(request.date_booking_id);
    } else {
      // For both 'pending' and 'completed' statuses
      handleViewAssignedRequest(request.date_booking_id);
    }
  };

  const renderStatusIcon = (request) => {
    if (updatingRequestId === request.date_booking_id) {
      return <ActivityIndicator size="small" color="#AD52F7" />;
    }

    switch (request.request_status) {
      case 'completed':
        return <TickCircle size={25} color="#AD52F7" variant="Bold" />;
      case 'rejected':
        return <CloseCircle size={25} color="#FF4D4F" variant="Bold" />;
      case 'pending':
        return (
          <TouchableOpacity
            onPress={() => handleStatusUpdate(request)}
            disabled={!!updatingRequestId}
          >
            <View style={styles.checkbox}>
              <View style={styles.innerCircle} />
            </View>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const unassignedRequests = securityRequests.filter(
    request => request.request_status === 'unassigned'
  );

  const renderUnassignedList = () => {
    if (unassignedRequests.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>No new security requests</Text>
        </View>
      );
    }

    return (
      <View style={styles.securityRequestsList}>
        {unassignedRequests.map((request) => (
          <TouchableOpacity
            key={request.date_booking_id}
            style={styles.requestsItem}
            onPress={() => handleRequestPress(request)}
          >
            <Image
              source={request.gender === 'male' ? require('../../assets/man.png') : require('../../assets/woman.png')}
              style={styles.requestsImage}
            />
            <View style={styles.requestsInfo}>
              <Text style={styles.requestsName}>
                {request.client_first_name}
              </Text>
              <Text style={styles.requestsRequests}>
                {request.pickup_location}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {!showRequest ? (
        <View style={styles.requestsCatalog}>
          {renderUnassignedList()}
        </View>
      ) : (
        <View style={styles.requestView}>
          <View style={styles.filterTabs}>
            {['pending', 'completed', 'rejected'].map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setAssignedFilter(filter)}
                style={styles.filterTab}
              >
                {assignedFilter === filter ? (
                  <LinearGradient
                    colors={['#AD52F7', '#CD8DFE']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientTab}
                  >
                    <Text style={styles.activeFilterText}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)} ({counts[filter]})
                    </Text>
                  </LinearGradient>
                ) : (
                  <View style={styles.inactiveTab}>
                    <Text style={styles.filterText}>
                      {filter.charAt(0).toUpperCase() + filter.slice(1)} ({counts[filter]})
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.securityRequestsList}>
            {filteredRequests.map((request) => (
              <TouchableOpacity
                key={request.date_booking_id}
                style={styles.requestsItem}
                onPress={() => handleRequestPress(request)}
              >
                <Image
                  source={request.gender === 'male' ? require('../../assets/man.png') : require('../../assets/woman.png')}
                  style={styles.requestsImage}
                />
                <View style={styles.requestsInfo}>
                  <Text style={styles.requestsName}>
                    {request.client_first_name}
                  </Text>
                  <Text style={styles.requestsRequests}>
                    {request.pickup_location}
                  </Text>
                </View>
                {renderStatusIcon(request)}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 12.5,
    borderWidth: 2,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: 'transparent',
  },
  requestsCatalog: {
    flex: 1,
  },
  securityRequestsList: {
    paddingHorizontal: 20,
    gap: 20,
  },
  requestsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestsImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  requestsInfo: {
    flex: 1,
  },
  requestsName: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '600',
  },
  requestsRequests: {
    fontSize: 14,
    color: '#BCBABA',
  },
  requestView: {
    flex: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    gap: 10,
  },
  filterTab: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradientTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  inactiveTab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  rejectedText: {
    fontSize: 14,
    color: '#FF4B4B',
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});