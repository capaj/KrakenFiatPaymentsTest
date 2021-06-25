import omitDeep from 'omit-deep-lodash'

export const matchSnapshotWithoutMeta = (val: object | any[]) => {
  return expect(omitDeep(val, 'created_at')).toMatchSnapshot()
}
