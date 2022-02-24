function showInstallPromotion(){
    var installAppModal = new bootstrap.Modal(document.getElementById('installAppModal'));
    installAppModal.show();
}


// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log(`'beforeinstallprompt' event was fired.`);
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.

});

const installAppBtn = document.getElementById('installApp')

installAppBtn.addEventListener('click', async () => {
  console.log('👍', 'butInstall-clicked');
//  var installAppModal = document.getElementById('installAppModal');
//  installAppModal.modal('hide')
  const promptEvent = deferredPrompt;
  if (!promptEvent) {
    console.log("The deferred prompt isn't available.")
    return;
  }
  // Show the install prompt.
  promptEvent.prompt();
  // Log the result
  const result = await promptEvent.userChoice;
  console.log('👍', 'userChoice', result);
  // Reset the deferred prompt variable, since
  // prompt() can only be called once.
  deferredPrompt = null;
  // Hide the install button.

});

window.addEventListener('appinstalled', (event) => {
  console.log('👍', 'appinstalled', event);
  // Clear the deferredPrompt so it can be garbage collected
  deferredPrompt = null;
});