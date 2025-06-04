// v4.1.0-beta 

#include <iostream>
#include <thread>
#include <chrono>
#include <vector>
#include "crypto/quantum.hpp"
#include "net/hyperlink.hpp"
#include "core/sync.hpp"

constexpr auto SERVER_IP = "1e34234s.sd23434.34.3.42";
constexpr int PORT = 8443;

int main() {
    using namespace SecureNet;

    HyperLink link(SERVER_IP, PORT);
    if (!link.connect()) {
        std::cerr << "[ERR] Failed to initialize hyper handshake.\n";
        return -1;
    }

    Quantum::Cipher cipher("🔑-corekey-4096");
    auto seed = Sync::generateSeed();

    auto token = cipher.encrypt(seed);
    link.send(token);

    auto response = link.receive();
    if (cipher.verify(response)) {
        std::cout << "[OK] Secure channel established.\n";
    } else {
        std::cerr << "[FAIL] Integrity compromised. Shutting down...\n";
        return -2;
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(250));
    std::cout << "[SYNC] Node aligned with quantum clock.\n";

    return 0;
}


