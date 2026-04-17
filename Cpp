#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

int main() {
    int n;
    cout << "Enter the number of users: ";
    cin >> n;

    vector<int> userID(n), startTime(n), numTrans(n);
    vector<vector<int>> durations(n);

    // Input
    for (int i = 0; i < n; i++) {
        cout << "Enter data for User " << i + 1 << endl;

        cout << "Enter user ID: ";
        cin >> userID[i];

        cout << "Enter starting time: ";
        cin >> startTime[i];

        cout << "Enter the number of transactions: ";
        cin >> numTrans[i];

        durations[i].resize(numTrans[i]);

        cout << "Enter the durations of the transactions: ";
        for (int j = 0; j < numTrans[i]; j++) {
            cin >> durations[i][j];
        }
    }

    int current_time = 0;
    double total_waiting_time = 0;
    int total_transactions = 0;

    // USER LEVEL FCFS
    for (int i = 0; i < n; i++) {

        // If CPU is idle, jump to user's start time
        if (current_time < startTime[i]) {
            current_time = startTime[i];
        }

        for (int j = 0; j < numTrans[i]; j++) {

            int start = current_time;
            int end = start + durations[i][j];

            // Waiting time based on user's initial start time
            int waiting = start - startTime[i];

            cout << "User " << userID[i]
                 << " Transaction " << j + 1
                 << ": Start time: " << start
                 << " End time: " << end
                 << " Waiting time: " << start
                 << "-" << startTime[i]
                 << " = " << waiting << " seconds" << endl;

            total_waiting_time += waiting;
            total_transactions++;

            current_time = end; // update system time
        }
    }

    double avg = total_waiting_time / total_transactions;

    cout << fixed << setprecision(2);
    cout << "Average waiting time: " << avg << " seconds" << endl;

    return 0;
}
