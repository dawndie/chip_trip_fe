import { axiosInstance } from "../axios";

import {
  GET_PLACE_BY_CITY,
  PAGE,
  COUNT,
  PLACE,
  RATING,
  POST_NEW_RATING,
  GET_CHECK_BOOKMARK,
  POST_NEW_BOOKMARK,
  DELETE_BOOKMARK,
  BOOKMARK,
  RECOMMENDER,
  GET_RECOMMEND_BY_ID,
  GET_SEARCH_BY_NAME_OR_ADD,
  GET_FILTER,
  SUGGEST_PLACE,
} from "../baseApi";

export default {
  getPlaceByCity({ place, page }) {
    return axiosInstance.get(`${GET_PLACE_BY_CITY}/${place}${PAGE}/${page}`);
  },
  getTotalNumberOfPlaceInCity({ place }) {
    return axiosInstance.get(`${GET_PLACE_BY_CITY}/${place}${COUNT}`);
  },
  getPlaceById({ id }) {
    return axiosInstance.get(`${PLACE}/${id}`);
  },
  getPlaceRatings({ id }) {
    return axiosInstance.get(`${PLACE}/${id}${RATING}`);
  },
  postNewRating({ id, reqBody }) {
    return axiosInstance.post(`${PLACE}/${id}${POST_NEW_RATING}`, reqBody);
  },
  getCheckBookMark(reqBody) {
    return axiosInstance.post(GET_CHECK_BOOKMARK, reqBody);
  },
  postNewBookmark(reqBody) {
    return axiosInstance.post(POST_NEW_BOOKMARK, reqBody);
  },
  deleteBookmark(reqBody) {
    return axiosInstance.delete(DELETE_BOOKMARK, { data: reqBody });
  },
  getUserBookmark() {
    return axiosInstance.get(BOOKMARK);
  },
  getRecommendById({ id = 7, num_rec = 5 }) {
    return axiosInstance.get(`${GET_RECOMMEND_BY_ID}/${id}`, {
      params: { num_rec },
    });
  },
  getRecommendByPlace({ id, num_rec = 5 }) {
    return axiosInstance.get(`${RECOMMENDER}/${id}`, { params: { num_rec } });
  },
  getSearchByNameOrAdd({ search, page, checkin, checkout, totalGuests }) {
    let url = `${GET_SEARCH_BY_NAME_OR_ADD}/${search}/${page}`;
    if (checkin) {
      url += `/${checkin}`;
    }
    if (checkout) {
      url += `/${checkout}`;
    }
    if (totalGuests) {
      url += `/${totalGuests}`;
    }
    return axiosInstance.get(url);
  },
  getFilter({ params, city, page = 1 }) {
    return axiosInstance.get(`${GET_FILTER}/${city}/${page}`, {
      params: { ...params },
    });
  },
  suggestPlace(query) {
    return axiosInstance.post(SUGGEST_PLACE, { query });
  },
};
