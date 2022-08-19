import { useHttp } from "../hooks/http.hook";

const useNasaService = () => {

    const {loading, error, request, clearError} = useHttp();
 
    const _apiBase = 'https://api.nasa.gov/';
    const _apiKey = 'api_key=IUkW3wtcdwNzddLKDaEgsmyHsA5HkMT1Vi1X92ZL';

    const getMissionManifest = async (rover) => {
        const res = await request(`${_apiBase}mars-photos/api/v1/manifests/${rover}/?${_apiKey}`);
        return _transformManifestData(res);
    }

    const getImagesData = async (rover) => {
        const res = await request(`${_apiBase}mars-photos/api/v1/rovers/${rover}/photos?sol=100&page=2&${_apiKey}`);
        return res.photos.map(_transformImagesData);
    }

    const _transformImagesData = (data) => {
        return {
            id: data.id,
            sol: data.sol,
            earthDate: data.earth_date,
            path: data.img_src,
            camera: data.camera.full_name,
            rover: data.rover.name
        }
    }

    const _transformManifestData = (data) => {
        return {
            landingDate: data.landing_date,
            launchDate: data.launch_date,
            maxDate: data.max_date,
            maxSol: data.max_sol,
            name: data.name,
            photos: data.photos,
            status: data.status,
            totalPhotos: data.total_photos
        }
    }

    return {
        loading,
        error,
        clearError,
        getImagesData,
        getMissionManifest
    }

}

export default useNasaService;