import React, {createContext, useState, useEffect, useContext} from 'react';
import {AuthContext} from './AuthContext';
import {BASE_URL} from '../utils/api';
import ErrorAlert from '../components/ErrorAlert';
import {TICKET_PATH, ACTIVITY_PATH} from '../constants/path';
import {Alert} from 'react-native';

export const AcitivityContext = createContext();

export const ActivityProvider = ({children}) => {
  const [pdLoading, setPDloading] = useState(false);
  const [chargerTickets, setChargerTickets] = useState([]);
  const [chargerAudit, setChargerAudit] = useState([]);
  const [chargerInstall, setChargerInstall] = useState([]);
  const [chargerVisit, setChargerVisit] = useState([]);
  const [photoClicked, setPhotoClicked] = useState([]);

  const [imgLabel, setImgLabel] = useState([]);
  const [physicalDamageImgLabel, setPhysicalDamageImgLabel] = useState([]);
  const {userId, setLoading} = useContext(AuthContext);

  const ticketsAssign = () => {
    setLoading(true);
    try {
      fetch(`${BASE_URL}/method/custom_pdg.api.get_open_issues?empId=${userId}`)
        .then(response => response.json())
        .then(data => {
          const {data: tickets} = data.message;
          const {_server_messages} = data;

          setChargerTickets(tickets);
          ErrorAlert({_server_messages});
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const auditAssign = () => {
    setLoading(true);
    try {
      fetch(
        `${BASE_URL}/resource/Audit?fields=%5B%22name%22,%22site_name%22,%22customer%22,%22address%22%5D&filters=%5B%5B%22assign%22,%22=%22,%22${userId}%22%5D,%5B%22status%22,%22!=%22,%22Closed%22%5D%5D
`,
      )
        .then(response => response.json())
        .then(data => {
          const {data: audit} = data;

          const {_server_messages} = data;
          ErrorAlert({_server_messages});

          setChargerAudit(audit);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const installationAssign = () => {
    setLoading(true);

    try {
      fetch(
        `${BASE_URL}/resource/Charger%20Installation?fields=%5B%22name%22,%22site_name%22,%22customer%22,%22address%22%5D&filters=%5B%5B%22assign%22,%22=%22,%22${userId}%22%5D,%5B%22status%22,%22!=%22,%22Closed%22%5D,%5B%22docstatus%22,%22=%22,0%5D%5D`,
      )
        .then(response => response.json())
        .then(data => {
          const {data: install} = data;

          const {_server_messages} = data;
          ErrorAlert({_server_messages});

          setChargerInstall(install);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const visitAssign = () => {
    setLoading(true);
    try {
      fetch(
        `${BASE_URL}/resource/PDG%20Maintenance?fields=%5B%22name%22,%22site_name%22,%22customer%22,%22select_pm1_or_pm2%22,%22address%22%5D&filters=%5B%5B%22assign%22,%22=%22,%22${userId}%22%5D,%5B%22status%22,%22!=%22,%22Closed%22%5D%5D
`,
      )
        .then(response => response.json())
        .then(data => {
          const {data: visit} = data;
          const {_server_messages} = data;
          ErrorAlert({_server_messages});
          setChargerVisit(visit);
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const getImgLabel = ({imgType, customer}) => {
    setLoading(true);
    try {
      fetch(`${BASE_URL}/resource/Activity%20Image%20label?fields=%5B%22label%22,%22mandatory%22%5D&filters=%5B%5B%22activity%22,%22=%22,%22${imgType}%22%5D,%5B%22customer%22,%22=%22,%22${customer}%22%5D%5D&order_by=mandatory%20desc
      `)
        .then(response => response.json())
        .then(data => {
          const {_server_messages} = data;
          ErrorAlert({_server_messages});
          setImgLabel(data.data);
          setLoading(false);
          console.log('IMAGE LABEL - ', data.data);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const getPhysicalDamageImgLabels = ({imgType, customer}) => {
    setPDloading(true);
    try {
      fetch(
        `${BASE_URL}/resource/Physical%20Damage%20Activity%20Image%20label?fields=%5B%22label%22,%22mandatory%22%5D&filters=%5B%5B%22activity%22,%22=%22,%22${imgType}%22%5D,%5B%22customer%22,%22=%22,%22${customer}%22%5D%5D&order_by=mandatory%20desc`,
      )
        .then(response => response.json())
        .then(data => {
          const {_server_messages} = data;
          ErrorAlert({_server_messages});
          setPhysicalDamageImgLabel(data.data);
          setPDloading(false);
        });
    } catch (error) {
      setPDloading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const sendIssueImg = issueImg => {
    try {
      setPhotoClicked([...photoClicked, issueImg.activity_label]);
      fetch(`${BASE_URL}/method/custom_pdg.api.upload_activity_images`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueImg),
      })
        .then(response => response.json())
        .then(data => {
          const {_server_messages} = data;
          // ErrorAlert({_server_messages});
          // console.log(data);
          console.log(data);
        });
    } catch (error) {
      setPhotoClicked([]);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const issueResolvedStatus = ({obj, navigation}) => {
    setLoading(true);
    try {
      fetch(`${BASE_URL}/method/custom_pdg.api.issue_resolved_status`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
        .then(response => response.json())
        .then(data => {
          const {_server_messages, message} = data;
          ErrorAlert({_server_messages});

          if (message !== undefined) {
            setLoading(false);
            ticketsAssign();
            setPhotoClicked([]);
            navigation.navigate(TICKET_PATH);
            return Alert.alert(message.message);
          }
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  const handleSelectApi = async ({api, setData}) => {
    try {
      const response = await fetch(api);
      const data = await response.json();

      const {_server_messages} = data;

      setData(data.data);
      ErrorAlert({_server_messages});
    } catch (error) {
      console.log('ERRORS SHOWING for dropdowns -> ', error);
      return error;
    }
  };

  const commonFormSubmit = ({obj, type, name, navigation}) => {
    setLoading(true);
    try {
      fetch(`${BASE_URL}/resource/${type}/${name}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj),
      })
        .then(response => response.json())
        .then(data => {
          const {_server_messages} = data;
          ErrorAlert({_server_messages});
          if (data.data) {
            setLoading(false);
            setPhotoClicked([]);
            navigation.navigate(ACTIVITY_PATH);
            return Alert.alert('Successful Submit');
          }
          setLoading(false);
        });
    } catch (error) {
      setLoading(false);
      console.log('ERRORS SHOWING -> ', error);
      return error;
    }
  };

  return (
    <AcitivityContext.Provider
      value={{
        ticketsAssign,
        auditAssign,
        visitAssign,
        installationAssign,
        chargerTickets,
        chargerAudit,
        chargerInstall,
        chargerVisit,
        getImgLabel,
        imgLabel,
        getPhysicalDamageImgLabels,
        physicalDamageImgLabel,
        sendIssueImg,
        handleSelectApi,
        issueResolvedStatus,
        commonFormSubmit,
        pdLoading,
        photoClicked,
      }}>
      {children}
    </AcitivityContext.Provider>
  );
};
