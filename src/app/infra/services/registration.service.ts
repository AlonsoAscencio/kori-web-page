import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  serverTimestamp,
  where,
} from '@angular/fire/firestore';
import { RegistrationPayload } from '../models/registration-payload';
import { from, map, switchMap } from 'rxjs';
import { RegistrationResult } from '../types/registration-result';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  //injects
  private readonly firestore = inject(Firestore);
  private readonly collectionName = 'founder_users';

  register(data: RegistrationPayload) {
    const phoneNormalized = data.phone.replace(/\D/g, '');

    const usersRef = collection(this.firestore, this.collectionName);

    const duplicatedPhoneQuery = query(usersRef, where('phone', '==', phoneNormalized));

    return from(getDocs(duplicatedPhoneQuery)).pipe(
      switchMap((snapshot) => {
        if (!snapshot.empty) {
          return from(Promise.resolve<RegistrationResult>('exists'));
        }

        return from(
          addDoc(usersRef, {
            fullName: data.fullName.trim(),
            phone: phoneNormalized,
            neighborhood: data.neighborhood.trim().toLowerCase(),
            createdAt: serverTimestamp(),
          }),
        ).pipe(map(() => 'created' as RegistrationResult));
      }),
    );
  }
}
