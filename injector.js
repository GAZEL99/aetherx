
document.getElementById("activateBtn").addEventListener("click", () => {
  // Coba buka aplikasi MLBB lewat deeplink
  window.location.href = "intent://mlbb#Intent;scheme=mlbb;package=com.mobile.legends;end";

  // Fallback ke Play Store kalau deeplink gagal (dalam 1.5 detik)
  setTimeout(() => {
    window.location.href = "https://play.google.com/store/apps/details?id=com.mobile.legends";
  }, 1500);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
});
