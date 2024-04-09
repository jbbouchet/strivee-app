import { FrenchLocality } from '@strivee-api/france-travail/domain/entities/french-locality';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('french_locality')
export class TypeormFrenchLocalityEntity implements FrenchLocality {
  /**
   * The unique locality id.
   */
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  /**
   * @inheritDoc
   */
  @Column({ type: 'citext' })
  public name: string;

  /**
   * @inheritDoc
   */
  @Column({ type: 'varchar' })
  public inseeCode: string;

  /**
   * @inheritDoc
   */
  @Column({ type: 'varchar' })
  public postalCode: string;
}
