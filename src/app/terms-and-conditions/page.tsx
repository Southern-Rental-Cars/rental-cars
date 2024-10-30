'use client';

import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="max-w-4xl mx-auto p-12 bg-white rounded-lg my-8">
      <h2 className="text-2xl font-semibold mb-1">Terms and Conditions</h2>
      <p className='text-gray-500 text-sm mb-4'> Last Updated: 10-28-24 </p>

      <h3 className="text-xl font-semibold mt-4">Guest Commitments</h3>
      <p>
        As a guest, you commit that you will be a legally licensed driver and provide proof to the host or via the Services of a current, valid driver’s license. You will treat the vehicle and any applicable Extras well and take all reasonable measures to return the vehicle and any applicable Extras on time and in essentially the same condition as received. You will not allow anyone other than a person listed in the trip details as an Approved Driver to drive the vehicle you booked.
      </p>

      <h3 className="text-xl font-semibold mt-4">Guest Financial Responsibility for Physical Damage to the Vehicle</h3>
      <p>
        The guest that booked the trip is financially responsible for all physical damage to or theft of a booked vehicle that occurs during a trip, plus any additional costs and fees resulting from damage of any kind to the vehicle, regardless of who is found to be at fault. This responsibility applies whether the primary guest has their own auto insurance or not.
      </p>
      <p>
        Primary guests may be insured against damage to the booked vehicle under their own automobile policies. When you book a vehicle, you agree that if any damage occurs to the booked vehicle during the booked trip, you will work with Southern Rental Cars to make a claim for coverage under any policy of insurance that applies to the loss.
      </p>

      <h3 className="text-xl font-semibold mt-4">Auto Liability Insurance and Legal Liability Protection</h3>
      <p>
        Southern Rental Cars cannot offer liability insurance.
      </p>
      <p>
        If the guest has their own personal auto policy, it will be primary over the auto liability insurance or protection provided with each trip, depending on various factors such as applicable laws, where the guest books the vehicle, and/or where the accident or damages occur. If the guest is using the vehicle for professional use, the auto liability insurance or protection provided with each trip will be excess to any other personal or commercial policy.
      </p>

      <h3 className="text-xl font-semibold mt-4">Use of the Vehicle</h3>
      <p>
        You may not access a vehicle until the trip start time and you must return the vehicle on time and to the correct location. You must maintain a current, valid driver’s license. You must exercise reasonable care in your use of the vehicle. You are always required to operate the vehicle safely, and in compliance with all applicable laws, including without limitation, speed limits and prohibitions on impaired or distracted driving. You are required to wear seat belts during the operation of the vehicle and to require that all of your passengers wear seat belts. You are also required to meet any laws or regulations concerning child safety seats and other protections for children. You must not leave the car unlocked or with the keys unsecure (such as in the ignition).
      </p>

      <h3 className="text-xl font-semibold mt-4">Vehicle Theft</h3>
      <p>
        The following conduct may result in the reporting of the vehicle you have booked as stolen to law enforcement, possibly subjecting you and any other driver to arrest, and civil and/or criminal penalties, and the voiding of your protection plan:
      </p>
      <ul className="list-disc pl-6">
        <li>If you fail to return the vehicle you booked at the time and place agreed upon with the host and/or designated in your reservation</li>
        <li>If you do not return the vehicle by the end of the reservation period and you have not properly obtained an extension of the reservation</li>
        <li>If the vehicle is returned to any place other than the return location on the reservation. Any damage to, or loss or theft of, a vehicle occurring prior to the host inspecting the vehicle upon return at the end of the reservation is the guest’s responsibility</li>
        <li>If you misrepresent facts to the host pertaining to booking, use, or operation of vehicle</li>
        <li>If the vehicle’s interior components are stolen or damaged, or the vehicle itself is stolen or damaged when the vehicle is left unlocked or running or unattended with the keys not secured during reservation period</li>
        <li>If you fail or refuse to communicate in good faith with Southern Rental Cars, or other authorities with a full report of any accident or vandalism involving the vehicle or otherwise fail to cooperate in the investigation of any accident or vandalism</li>
        <li>If the vehicle is operated by anyone who has given a fictitious name, false address, or a false or invalid driver’s license, whose driver’s license becomes invalid during the reservation period, who has obtained the keys without permission of the host, or who misrepresents or withholds facts to/from Southern Rental Cars material to the booking, use, or operation of vehicle</li>
      </ul>

      <h3 className="text-xl font-semibold mt-4">Repossessions</h3>
      <p>
        Southern Rental Cars or a hired agent may repossess any vehicle without demand, at the guest’s expense, if the vehicle is not returned by the end of the reservation, is found illegally parked, apparently abandoned, or used in violation of applicable law or these Terms.
      </p>

      <h3 className="text-xl font-semibold mt-4">Missing Vehicles</h3>
      <p>
        If a vehicle you have booked goes missing and/or is stolen during the reservation period (or extension period), you must immediately return the original ignition key to the host, file a police report immediately after discovering the vehicle is missing or stolen, but in no event more than 12 hours after discovering it has gone missing, and cooperate fully with the host, law enforcement, Turo, and other authorities in all matters related to the investigation.
      </p>
    </div>
  );
}