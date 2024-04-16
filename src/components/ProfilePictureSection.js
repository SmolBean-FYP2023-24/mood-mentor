import React, { useState } from "react";
import { Dialog } from "primereact/dialog";

function ProfilePictureSection() {
  const [imagecrop, setimagecrop] = useState(false);
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(
    localStorage.getItem("profilePicture") || "default-profile-picture-url"
  );

  const profilePictures = [
    "https://i.imgur.com/qj4Daxo.png",
    "https://i.imgur.com/D0wrQ3z.png",
    "https://i.imgur.com/Ze3ya0W.png",
    "https://i.imgur.com/3oT5Gfq.png",
    "https://i.imgur.com/hzAggnO.png",
    "https://i.imgur.com/FcBItan.png",
  ];

  const handleProfilePictureClick = () => {
    setimagecrop(true);
  };

  const handleProfilePictureSelect = (pictureUrl) => {
    setSelectedProfilePicture(pictureUrl);
    localStorage.setItem("profilePicture", pictureUrl);
    setimagecrop(false);
  };

  return (
    <>
      <img
        style={{
          zIndex: "1",
          width: "25vh",
          height: "25vh",
          borderRadius: "50%",
          objectFit: "cover",
          marginLeft: "4vh",
          marginTop:"2vh",
        }}
        onClick={handleProfilePictureClick}
        src={selectedProfilePicture || "default-profile-picture-url"}
        alt=""
      />
      <Dialog
        visible={imagecrop}
        header={() => (
          <div className="custom-dialog-header">
            <p className="text-2xl font-semibold textColor">
              Choose new profile icon:
            </p>
            <div className="image-container">
              {profilePictures.map((pictureUrl) => (
                <img
                  key={pictureUrl}
                  src={pictureUrl}
                  alt=""
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    padding: "5px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onClick={() => handleProfilePictureSelect(pictureUrl)}
                />
              ))}
            </div>
          </div>
        )}
        onHide={() => setimagecrop(false)}
        style={{
          width: "200px",
          display: "flex",
          flexDirection: "column",
        }}
        className="custom-dialog"
      >
        <div className="confirmation-content flex flex-column align-items-center flex-grow-1"></div>
      </Dialog>
    </>
  );
}

export default ProfilePictureSection;
