import ReactPlayer from 'react-player'
export default function VideoGallery() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <ReactPlayer width="100%" height="300px" src='https://www.youtube.com/watch?v=jZ0LZ2jddws'/>
        <ReactPlayer width="100%" height="300px" src='https://www.youtube.com/watch?v=jjzv2l1tgyY'/>
        <ReactPlayer width="100%" height="300px" src='https://www.youtube.com/watch?v=N_XcjnOQzwA'/>
        <ReactPlayer width="100%" height="300px" src='https://www.youtube.com/watch?v=9Wq6HvfP-wQ'/>
        <ReactPlayer width="100%" height="300px" src='https://www.youtube.com/watch?v=DAvN2Gpy_ls'/>
    </div>
  )
}
