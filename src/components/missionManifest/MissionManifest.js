import './missionManifest.scss';

import curiosityImg from '../../images/curiosity.jpg';
import spiritAndOpportunityImg from '../../images/opportunity.jpg';
import perseveranceImg from '../../images/perseverance.jpg';

import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import useNasaService from '../../services/useNasaService';
import ManifestSkeleton from '../manifestSkeleton/ManifestSkeleton';
import Spinner from '../spinner/Spinner';
import RoverPhotoModal from '../roverPhotoModal/RoverPhotoModal';
import ErrorMessage from '../errorMessage/ErrorMessage';

const MissionManifest = (props) => {

    const [manifestData, setManifestData] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [manifestDataLoaded, setManifestDataLoaded] = useState(false);
    const [spinnerReady, setSpinnerReady] = useState(true);

    const { loading, getMissionManifest, clearError, error} = useNasaService();

    const onManifestDataLoaded = (data) => {
        setManifestData(data);
        props.setManifestData(data);
        props.setLoading(false)
    }

    const onRequestManifest = (rover) => {
        clearError();
        props.setLoading(true)
        getMissionManifest(rover)
            .then(onManifestDataLoaded);
    }

    const onModalClose = () => {
        setModalOpen(false);
    }

    useEffect(() => {
        if (!props.clickedRover) return;
        onRequestManifest(props.clickedRover)
        // eslint-disable-next-line
    }, [props.clickedRover])

    useEffect(() => {
        if(!manifestData) return;
        const {maxSol} = manifestData;
        props.setMaxSol(maxSol);
        // eslint-disable-next-line
    }, [manifestData]);

    useEffect(() => {
        if (manifestData && !loading && !modalOpen) {
            setManifestDataLoaded(true); /* for css transition */
        } else {
            setManifestDataLoaded(false);
        }
    }, [manifestData, loading, modalOpen]);

    let roverPhoto;
    if (props.clickedRover === 'spirit' || props.clickedRover === "opportunity") {
        roverPhoto = spiritAndOpportunityImg;
    } else if (props.clickedRover === 'curiosity') {
        roverPhoto = curiosityImg;
    } else if (props.clickedRover === "perseverance") {
        roverPhoto = perseveranceImg;
    }

    const duration = 300;

    const skeleton = manifestData || loading || error ? null : <ManifestSkeleton/>;
    const spinner = loading && spinnerReady ? <Spinner/> : null;
    const modal = <RoverPhotoModal open={modalOpen} onModalClose={onModalClose} roverPhoto={roverPhoto} />;
    const errorMessage = error ? <ErrorMessage/> : null;
    const content = error ? null : 
        <CSSTransition 
            in={manifestDataLoaded} 
            classNames="missionManifest"
            unmountOnExit
            timeout={duration}
            onEnter={() => setSpinnerReady(false)}
            onExited={() => setSpinnerReady(true)}>
            <View 
                roverPhoto={roverPhoto} 
                manifestData={manifestData} 
                setModalOpen={setModalOpen} />
        </CSSTransition>;

    const wrapStyles = loading && spinnerReady ? {"display" : "flex", "height": "300px", "justifyContent": "center", "alignItems": "center"} : null;

    if (modalOpen) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "visible";
    }

    return (
        <>
            {modal}
            <div className="missionManifest__wrapper" style={wrapStyles}>
                {errorMessage}
                {skeleton}
                {spinner}
                {content}
            </div>
        </>
    )
}

const View = (props) => {

    const { landingDate, launchDate, maxDate, maxSol, name, status, totalPhotos } = props.manifestData;

    return (
        <div className="missionManifest">
            <div className="missionManifest__img" onClick={() => {props.setModalOpen(true)}} >
                <img src={props.roverPhoto} alt="" />
            </div>
            <ul className="missionManifest__list">
                <h2>Mission manifest</h2>
                <li>Name: {name}</li>
                <li>Landing date: {landingDate}</li>
                <li>Launch date: {launchDate}</li>
                <li>Max date: {maxDate}</li>
                <li>Max sol: {maxSol}</li>
                <li>Status: {status}</li>
                <li>Total photos: {totalPhotos}</li>
            </ul>
        </div>
    )

}

export default MissionManifest;


