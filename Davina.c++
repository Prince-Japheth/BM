#include <iostream>
#include <cmath>

using namespace std;

int main() {
    // Constants
    const double g = 9.81; // Acceleration due to gravity (m/s^2)
    const double theta = 30 * M_PI / 180; // Angle in radians
    const double distance = 10.0; // Length of inclined plane (m)

    // Calculate acceleration along the inclined plane
    double a = g * sin(theta);

    // Calculate time to reach the bottom
    double time = sqrt((2 * distance) / a);

    // Calculate velocity at the bottom
    double velocity = a * time;

    // Output the results
    cout << "Acceleration of the block: " << a << " m/s^2" << endl;
    cout << "Time to reach the bottom: " << time << " s" << endl;
    cout << "Velocity at the bottom: " << velocity << " m/s" << endl;

    return 0;
}
